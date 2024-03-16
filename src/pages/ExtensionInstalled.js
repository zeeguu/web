import * as s from "./ExtensionInstalled.sc";
import { getSessionFromCookies } from "../utils/cookies/userInfo";
import * as z from "../components/FormPage.sc";
import strings from "../i18n/definitions";
import { useEffect } from "react";
import LocalStorage from "../assorted/LocalStorage";

export default function ExtensionInstalled({ api }) {
  useEffect(() => {
    api.logUserActivity(api.OPEN_EXTENSION_INSTALLED);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <s.PageBackground>
      <s.ExtensionContainer>
        <s.ExtensionInstalledWrapper>
          <img
            src="../static/images/zeeguuLogo.svg"
            alt=""
            style={{ width: "36px" }}
          />
          <header>
            <h1>
              Right-click anywhere on any article’s page<br></br> to access The
              Zeeguu Reader extension
            </h1>
          </header>
          <body>
            <img
              style={{ width: "80%" }}
              src={"../static/images/use-extension.png"}
              alt="How to pin Chrome Extension to Chrome Toolbar gif"
            />
          </body>
          <footer>
            <s.LinkContainer>
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
            </s.LinkContainer>
          </footer>
        </s.ExtensionInstalledWrapper>
      </s.ExtensionContainer>
    </s.PageBackground>
  );
}
