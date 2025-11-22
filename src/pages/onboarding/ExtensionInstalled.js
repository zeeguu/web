import { getSessionFromCookies } from "../../utils/cookies/userInfo";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import FullWidthImage from "../../components/FullWidthImage";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Footer from "../_pages_shared/Footer.sc";
import Button from "../_pages_shared/Button.sc";

import strings from "../../i18n/definitions";
import { runningInChromeDesktop } from "../../utils/misc/browserDetection";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";

export default function ExtensionInstalled() {
  const api = useContext(APIContext);
  const history = useHistory();
  useEffect(() => {
    setTitle(strings.extensionInstalled);
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PreferencesPage>
      <Header>
        <Heading>
          Right-click to&nbsp; activate the&nbsp;Zeeguu&nbsp;
          {runningInChromeDesktop() ? "extension" : "add-on"}
          on any page containing an article.
        </Heading>
      </Header>
      <Main>
        <FullWidthImage src={"read-any-article.gif"} />
      </Main>
      <Footer>
        <ButtonContainer className={"padding-large"}>
          {getSessionFromCookies() ? (
            <Button className={"full-width-btn"} onClick={() => history.push("/articles/swiper")}>
              {strings.goToZeeguuApp}
            </Button>
          ) : (
            <>
              <Button className={"full-width-btn"} onClick={() => history.push("/language_preferences")}>
                {strings.createAccount}
              </Button>
              <Button className={"full-width-btn"} onClick={() => history.push("/log_in")}>
                {strings.login}
              </Button>
            </>
          )}
        </ButtonContainer>
      </Footer>
    </PreferencesPage>
  );
}
