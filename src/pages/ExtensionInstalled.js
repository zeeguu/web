import * as s from "./ExtensionInstalled.sc";
import { getUserSession } from "../utils/cookies/userInfo";
import * as z from "../components/FormPage.sc";
import strings from "../i18n/definitions";

export default function ExtensionInstalled() {
  return (
    <s.PageBackground>
      <z.LogoOnTop />
      <s.ExtensionContainer>
        <s.ExtensionInstalledWrapper>
          <h1>{strings.congratulations}</h1>
          <p>{strings.pinExtension}
          </p>
          <img
            src={"/static/images/zeeguuExtension.gif"}
            alt="How to pin Chrome Extension to Chrome Toolbar gif"
          />
          <s.LinkContainer>
            {getUserSession() ? (
              <s.OrangeButton>
                <a href="/articles">{strings.goToArticles}</a>
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
        </s.ExtensionInstalledWrapper>
      </s.ExtensionContainer>
    </s.PageBackground>
  );
}
