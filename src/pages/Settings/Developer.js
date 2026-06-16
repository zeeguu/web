import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../contexts/APIContext";
import CardPage from "../_pages_shared/CardPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
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
    <CardPage layoutVariant={"minimalistic-top-aligned"} isTransparent reducedPadding>
      <BackArrow />
      <Header withoutLogo>
        <Heading>Developer</Heading>
      </Header>
      <Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </CardPage>
  );
}
