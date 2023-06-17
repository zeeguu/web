import * as s from "./ExtensionInstalled.sc";
import { getUserSession } from "../utils/cookies/userInfo";
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
      <z.LogoOnTop />
      <s.ExtensionContainer>
        <s.ExtensionInstalledWrapper>
          <h1>{strings.congratulations}</h1>
          <h4>{strings.pinExtension}</h4>
          <s.VideoLink>Learn how it works by watching
            <a href="https://vimeo.com/715531198" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => LocalStorage.setClickedVideo()}> this video</a>
          </s.VideoLink>
          <img
            src={"https://zeeguu.org/static/images/zeeguuExtension.gif"}
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
