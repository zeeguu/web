import { useContext, useEffect, useState } from "react";
import { APIContext } from "../../contexts/APIContext";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Main from "../_pages_shared/Main.sc";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import { setTitle } from "../../assorted/setTitle";
import { HeaderWrapper, BackArrowWrapper } from "./Settings.sc";

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
      <HeaderWrapper>
        <BackArrowWrapper>
          <BackArrow />
        </BackArrowWrapper>
        <Header withoutLogo>
          <Heading>Developer</Heading>
        </Header>
      </HeaderWrapper>
      <Main>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <Button onClick={handleClearOnboardingMessages}>Clear onboarding message table</Button>
        </ButtonContainer>
        {status && <p style={{ marginTop: "1em" }}>{status}</p>}
      </Main>
    </PreferencesPage>
  );
}
