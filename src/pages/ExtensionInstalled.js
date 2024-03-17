import * as s from "./info_page_shared/InfoPage.sc";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import strings from "../i18n/definitions";
import { useEffect } from "react";
import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Main from "./info_page_shared/Main";
import ImageMain from "./info_page_shared/ImageMain";
import Footer from "./info_page_shared/Footer";

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InfoPage>
      <Header>
        Right-click anywhere on any article’s page to&nbsp;access
        The&nbsp;Zeeguu&nbsp;Reader&nbsp;extension
      </Header>
      <Main>
        <ImageMain src={"../static/images/use-extension.png"} />
      </Main>
      <Footer>
        {getSessionFromCookies() ? (
          <s.OrangeButton>
            <a href="/articles">Go to Zeeguu App</a>
          </s.OrangeButton>
        ) : (
          <>
            <s.OrangeButton>
              <a href="/login">{strings.login}</a>
            </s.OrangeButton>

            <s.OrangeButton>
              <a href="/create_account">{strings.createAccount}</a>
            </s.OrangeButton>
          </>
        )}
      </Footer>
    </InfoPage>
  );
}
