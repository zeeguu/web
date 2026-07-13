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

  // These open admin HTML pages served directly by the API. The session lives
  // on zeeguu.org (not api.zeeguu.org), so we hand it over as a query param; the
  // API gates each page on is_admin regardless. This also makes the API's
  // standalone /admin/login password form unnecessary.
  function openApiPage(path) {
    window.open(`${api.baseAPIurl}${path}?session=${api.session}`, "_blank", "noopener,noreferrer");
  }

  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title="Developer" />
      <Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
          <Button onClick={() => openApiPage("/status")}>Server health</Button>
          <Button onClick={() => openApiPage("/user_stats/dashboard")}>Admin dashboard</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </CardPage>
  );
}
