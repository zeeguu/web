import { getSessionFromCookies } from "../utils/cookies/userInfo";
import { useEffect } from "react";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import MainImage from "../components/MainImage";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoPage>
      <Header>
        <Heading>
          Right-click anywhere on any article’s page to&nbsp;access
          The&nbsp;Zeeguu&nbsp;Reader extension
        </Heading>
      </Header>
      <Main>
        <MainImage src={"../static/images/use-extension.png"} />
      </Main>
      <Footer>
        <ButtonContainer>
          {getSessionFromCookies() ? (
            <Button href={"/articles"}>Go to Zeeguu App</Button>
          ) : (
            <>
              <Button href={"/create_account"}>Create Account</Button>
              <Button href={"/login"}>Log In</Button>
            </>
          )}
        </ButtonContainer>
      </Footer>
    </InfoPage>
  );
}
