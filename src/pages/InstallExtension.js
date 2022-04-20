import { LogoOnTop } from "../components/FormPage.sc";
import strings from "../i18n/definitions";
import { PageBackground, ExtensionContainer } from "./ExtensionInstalled.sc";
import * as s from "./InstallExtension.sc";

export default function InstallExtension() {
  return (
    <PageBackground>
      <LogoOnTop />
      <ExtensionContainer>
        <s.InstallExtensionWrapper>
          <h1>{strings.userCreated}</h1>
          <h4>{strings.installExtension}</h4>
          <p>{strings.extensionDescription}</p>
          <p>{strings.extensionFunctionality}</p>
          <ul>
            <li>
              <p>{strings.extensionAdvantage1}</p>
            </li>
            <li>
              <p>{strings.extensionAdvantage2}</p>
            </li>
            <li>
              <p>{strings.extensionAdvantage3}</p>
            </li>
          </ul>
          <s.LinkContainer>
            <s.OrangeButton>
              <a href="https://chrome.google.com/webstore/detail/the-zeeguu-reader/ckncjmaednfephhbpeookmknhmjjodcd">
                Install for Chrome
              </a>
            </s.OrangeButton>
            <s.OrangeButton>
              <a href="">Install for Firefox</a>
            </s.OrangeButton>
            <a href="/articles">Don't want the extension? Go to articles.</a>
          </s.LinkContainer>
        </s.InstallExtensionWrapper>
      </ExtensionContainer>
    </PageBackground>
  );
}
