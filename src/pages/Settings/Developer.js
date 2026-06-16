import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../contexts/APIContext";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import SettingsPageHeader from "./settings_pages_shared/SettingsPageHeader";
import { setTitle } from "../../assorted/setTitle";

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

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <SettingsPageHeader title="Developer" />
      <Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </PreferencesPage>
  );
}
