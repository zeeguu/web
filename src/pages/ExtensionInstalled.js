import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { useEffect } from "react";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import FullWidthImage from "../components/FullWidthImage";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";

import strings from "../i18n/definitions";
import redirect from "../utils/routing/routing";

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoPage>
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
                onClick={() => redirect("/select_interests")}
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
    </InfoPage>
  );
}
