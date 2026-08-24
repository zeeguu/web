import { useEffect } from "react";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import Button from "../../_pages_shared/Button.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import { enterKioskMode } from "../../../kiosk/kioskMode";

import * as s from "./Labs.sc";

// Labs is the home for opt-in, still-moving features: shipped to everybody,
// but not yet promised to stay. Deliberately not behind a feature flag —
// an experiment nobody can find never gets the feedback that would tell us
// whether to graduate it into a real setting.
//
// To add an experiment, append to EXPERIMENTS below. Anything that is really
// a lasting per-user preference belongs in its own settings section instead.

// Turns this device into a locked-down, chrome-less news reader (no
// translations, no settings, no navigation) over the learned language's feed.
// Meant for a dedicated device, typically also kept in iOS Assistive Access.
// The confirm — not obscurity — is what keeps people from stranding
// themselves: the exit gesture is intentionally hard to hit by accident.
function handleEnterKioskMode() {
  if (
    window.confirm(
      "Enter kiosk reader mode? The app becomes a plain news reader with no menus, settings, or translations.\n\n" +
        "To exit: tap the top-right corner of the screen 5 times.",
    )
  ) {
    enterKioskMode();
  }
}

const EXPERIMENTS = [
  {
    key: "kiosk_reader",
    name: "Kiosk reader mode",
    description:
      "Turns this device into a plain news reader in the language you are learning — no menus, no settings, no translations. " +
      "Made for a dedicated device, like a phone left out for someone who just wants to read. " +
      "To leave it again, tap the top-right corner of the screen 5 times.",
    actionLabel: "Enter kiosk reader mode",
    onAction: handleEnterKioskMode,
  },
];

export default function Labs() {
  useEffect(() => {
    setTitle("Labs");
  }, []);

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Labs" />
      <Main>
        <s.Intro>
          Experiments we are still trying out. They work, but they may change, move, or disappear in a later version.
        </s.Intro>

        {EXPERIMENTS.map((experiment) => (
          <s.Experiment key={experiment.key}>
            <h3>{experiment.name}</h3>
            <p>{experiment.description}</p>
            <Button className={"small"} onClick={experiment.onAction}>
              {experiment.actionLabel}
            </Button>
          </s.Experiment>
        ))}
      </Main>
    </CardPage>
  );
}
