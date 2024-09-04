import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { useEffect } from "react";
import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading";
import Main from "./_pages_shared/Main";
import FullWidthImage from "../components/FullWidthImage";
import ButtonContainer from "./_pages_shared/ButtonContainer";
import Footer from "./_pages_shared/Footer";
import Button from "./_pages_shared/Button";

import strings from "../i18n/definitions";
import redirect from "../utils/routing/routing";

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Right-click anywhere on any article’s page to&nbsp;access The Zeeguu
          Reader&nbsp;extension
        </Heading>
      </Header>
      <Main>
        <FullWidthImage src={"use-extension.png"} />
      </Main>
      <Footer>
        <ButtonContainer className={"padding-large"}>
          {getSessionFromCookies() ? (
            <Button
              className={"full-width-btn"}
              onClick={() => redirect("/articles")}
            >
              {strings.goToZeeguuApp}
            </Button>
          ) : (
            <>
              <Button
                className={"full-width-btn"}
                onClick={() => redirect("/language_preferences")}
              >
                {strings.createAccount}
              </Button>
              <Button
                className={"full-width-btn"}
                onClick={() => redirect("/login")}
              >
                {strings.login}
              </Button>
            </>
          )}
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
