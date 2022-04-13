import { Link } from "react-router-dom";
import * as s from "../components/ExtensionInstalled.sc";
import { getUserSession } from "../utils/cookies/userInfo";

export default function ExtensionInstalled() {
  if (getUserSession()) {
    return (
      <s.ExtensionInstalledWrapper>
        <h1>Congratulations!</h1>
        <p>You have installed the extension.</p>
        <p>Don't forget to pin it</p>
        <Link to="/articles">Go to articles</Link>
      </s.ExtensionInstalledWrapper>
    );
  } else {
    return (
      <s.ExtensionInstalledWrapper>
        <h1>Congratulations!</h1>
        <p>You have installed the extension.</p>
        <p>Don't forget to pin it.</p>
        <s.PaddedLink to="/login">Login</s.PaddedLink>
        <s.PaddedLink to="/create_account">Create account</s.PaddedLink>
      </s.ExtensionInstalledWrapper>
    );
  }
}
