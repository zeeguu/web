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

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoPage>
      <Header>
        <Heading>
          Right-click anywhere on any article’s page to&nbsp;access
          The Zeeguu Reader&nbsp;extension
        </Heading>
      </Header>
      <Main>
        <FullWidthImage src={"use-extension.png"} />
      </Main>
      <Footer>
        <ButtonContainer>
          {getSessionFromCookies() ? (
            <Button href={"/articles"}>{strings.goToZeeguuApp}</Button>
          ) : (
            <>
              <Button href={"/create_account"}>{strings.createAccount}</Button>
              <Button href={"/login"}>{strings.login}</Button>
            </>
          )}
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
