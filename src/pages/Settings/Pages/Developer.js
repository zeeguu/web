import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";
import { enterKioskMode } from "../../../kiosk/kioskMode";

export default function Developer() {
  const api = useContext(APIContext);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setTitle("Developer");
  }, []);

  function handleClearOnboardingMessages() {
    setStatus(null);
    api
      .clearOnboardingMessages()
      .then(({ deleted }) => setStatus(`Cleared ${deleted} onboarding message record(s).`))
      .catch(() => setStatus("Failed to clear onboarding messages."));
  }

  // These open admin HTML pages served directly by the API. The session lives
  // on zeeguu.org (not api.zeeguu.org), so we hand it over as a query param; the
  // API gates each page on is_admin regardless. This also makes the API's
  // standalone /admin/login password form unnecessary.
  function openApiPage(path) {
    window.open(`${api.baseAPIurl}${path}?session=${api.session}`, "_blank", "noopener,noreferrer");
  }

  // Copy the session token to the clipboard — for pasting into the Scriptable
  // home-screen widget (so you don't have to fish it out of the console on a phone).
  // Turns this device into a locked-down, chrome-less news reader (no
  // translations, no settings, no navigation) over the learned language's
  // feed. Exit by tapping the top-right corner 5 times. Meant for a dedicated
  // device, typically also kept in iOS Assistive Access.
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

  async function handleCopySession() {
    setStatus(null);
    try {
      await navigator.clipboard.writeText(api.session || "");
      setStatus("Session copied to clipboard.");
    } catch {
      // Clipboard API can be blocked; show it so it can be long-pressed to copy.
      setStatus(`Copy this session manually: ${api.session}`);
    }
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Developer" />
      <Main>
        <ButtonContainer>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
          <Button onClick={() => openApiPage("/status")}>Server health</Button>
          <Button onClick={() => openApiPage("/user_stats/dashboard")}>Admin dashboard</Button>
          <Button onClick={handleCopySession}>Copy session (for widget)</Button>
          <Button onClick={handleEnterKioskMode}>Enter kiosk reader mode</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </CardPage>
  );
}
