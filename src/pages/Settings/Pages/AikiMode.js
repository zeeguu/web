import { useEffect, useState } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import Button from "../../_pages_shared/Button.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import FullWidthInfoMsg from "../../../components/FullWidthInfoMsg.sc";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import { setTitle } from "../../../assorted/setTitle";
import { SectionHeading, SectionDescription } from "./FeedPreferences.sc";
import { AikiCard, AikiState, ChangeLink } from "./AikiMode.sc";
import {
  ZeeguuShield,
  aikiStep,
  describePicked,
  nativeShieldAvailable,
  pickedCount,
} from "../../../components/nativeShield";

// Aiki mode: pause the apps a learner finds distracting (iOS only). Setup is
// split into steps on purpose: right after Screen Time access is granted,
// Apple's picker can show its categories with no apps in them, and the pause
// between the two steps gives iOS time to fill the list.
export default function AikiMode() {
  const [status, setStatus] = useState(null);
  const [nothingPicked, setNothingPicked] = useState(false);
  const [error, setError] = useState(null);
  const [statusFailed, setStatusFailed] = useState(false);

  useEffect(() => {
    setTitle("Aiki mode");
    refresh();
  }, []);

  function refresh() {
    if (!nativeShieldAvailable()) {
      setStatus({ supported: false });
      return Promise.resolve();
    }
    // Once, the native call never answered and the page stayed blank; give up
    // after a few seconds and offer to try again.
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000));
    return Promise.race([ZeeguuShield.getStatus(), timeout])
      .then((s) => {
        setStatusFailed(false);
        setStatus(s);
      })
      .catch(() => setStatusFailed(true));
  }

  async function run(action) {
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e.message);
    }
    await refresh();
  }

  function handleAuthorize() {
    run(() => ZeeguuShield.requestAuthorization());
  }

  function handlePick() {
    run(async () => {
      const picked = await ZeeguuShield.presentAppPicker();
      if (picked.cancelled) return;
      setNothingPicked(pickedCount(picked) === 0);
      // Choosing apps the first time means wanting them paused.
      if (pickedCount(picked) > 0 && !status.shieldActive) await ZeeguuShield.applyShield();
    });
  }

  function handleToggleShield() {
    run(() => (status.shieldActive ? ZeeguuShield.removeShield() : ZeeguuShield.applyShield()));
  }

  const step = aikiStep(status);

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Aiki mode" />
      <Main>
        <AikiCard>
          <SectionDescription>
            Aiki mode pauses the apps that distract you. A minute of learning in Zeeguu unlocks them for the next 5 minutes;
            learn 15 minutes and they're free until tomorrow.
          </SectionDescription>
        </AikiCard>

        {!status && statusFailed && (
          <AikiCard>
            <FullWidthErrorMsg>Couldn't read Aiki mode's status.</FullWidthErrorMsg>
            <Button className={"small"} onClick={refresh} style={{ marginTop: "1rem" }}>
              Try again
            </Button>
          </AikiCard>
        )}

        {step === "unsupported" && status && (
          <FullWidthInfoMsg>Aiki mode needs the Zeeguu iPhone app on iOS 16 or newer.</FullWidthInfoMsg>
        )}

        {step === "authorize" && (
          <AikiCard>
            <SectionHeading>1. Allow Screen Time access</SectionHeading>
            <SectionDescription>
              Zeeguu uses Screen Time to pause apps. We never see which apps you choose: your phone keeps that to
              itself.
            </SectionDescription>
            <Button className={"small"} onClick={handleAuthorize} style={{ marginTop: "1rem" }}>
              Allow access
            </Button>
          </AikiCard>
        )}

        {step === "pick" && (
          <AikiCard>
            <SectionHeading>2. Choose the apps that distract you</SectionHeading>
            <SectionDescription>
              Tip: tick <b>Social</b> to cover Instagram, TikTok, X and the rest at once. Or open a category to choose
              single apps.
            </SectionDescription>
            <Button className={"small"} onClick={handlePick} style={{ marginTop: "1rem" }}>
              Choose apps
            </Button>
          </AikiCard>
        )}

        {step === "ready" && (
          <AikiCard>
            <SectionHeading>
              Aiki mode is <AikiState $on={status.shieldActive}>{status.shieldActive ? "on" : "off"}</AikiState>
            </SectionHeading>
            <SectionDescription style={{ color: "var(--text-secondary)" }}>
              {status.shieldActive ? "Paused" : "Chosen"}: {describePicked(status)}.{" "}
              <ChangeLink onClick={handlePick}>Change</ChangeLink>
            </SectionDescription>
            <Button className={"small"} onClick={handleToggleShield} style={{ marginTop: "1.5rem" }}>
              {status.shieldActive ? "Turn off" : "Turn on"}
            </Button>
          </AikiCard>
        )}

        {nothingPicked && (
          <FullWidthInfoMsg>
            No apps were chosen. If the list was empty, wait a moment and open it again. Still empty? On your phone,
            turn on Settings → Screen Time → App & Website Activity.
          </FullWidthInfoMsg>
        )}

        {error && <FullWidthErrorMsg>{error}</FullWidthErrorMsg>}
      </Main>
    </CardPage>
  );
}
