import { Link } from "react-router-dom";
import * as s from "../components/ExtensionInstalled.sc";
import { getUserSession } from "../utils/cookies/userInfo";
import * as z from "../components/FormPage.sc";

export default function ExtensionInstalled() {
  return (
    <z.PageBackground>
      <z.LogoOnTop />
      <s.ExtensionContainer>
        <s.ExtensionInstalledWrapper>
          <h1>Congratulations</h1>
          <p>
            Welcome to Zeeguu! You are now ready to enrich your vocabulary in a
            foreign language while browsing the web. Don't forget to pin the
            extension to the Chrome Toolbar.
          </p>
          <s.LinkContainer>
            {getUserSession() ? (
              <Link to="/articles">Go to articles</Link>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/create_account">Create account</Link>
              </>
            )}
          </s.LinkContainer>
          <img
            src={"/static/images/zeeguuExtension.gif"}
            alt="How to pin Chrome Extension to Chrome Toolbar gif"
          />
        </s.ExtensionInstalledWrapper>
      </s.ExtensionContainer>
    </z.PageBackground>
  );
}
