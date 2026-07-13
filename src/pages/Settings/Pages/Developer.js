import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../contexts/APIContext";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import { setTitle } from "../../../assorted/setTitle";

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

  // Opens the API's dev-only /status server-health page. The session lives on
  // zeeguu.org (not api.zeeguu.org), so we hand it over as a query param — the
  // API gates the page on is_dev regardless.
  function openServerHealth() {
    window.open(`${api.baseAPIurl}/status?session=${api.session}`, "_blank", "noopener,noreferrer");
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Developer" />
      <Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
          <Button onClick={openServerHealth}>Server health</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </CardPage>
  );
}
