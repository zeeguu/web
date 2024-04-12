import { useState, useRef, useEffect } from "react";

import strings from "../i18n/definitions";

import * as s from "../components/FormPage.sc";
import LocalStorage from "../assorted/LocalStorage";

export default function SignIn({
  api,
  handleSuccessfulSignIn,
  setRedirectLink,
}) {
  // TODO: Fix this bug in a different way. Requires understanding why strings._language changes to "da" without it being asked to, whenever this component renders. Perhaps it imports an un-updated version of strings?
  strings.setLanguage(LocalStorage.getUiLanguage().code);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let emailInputDOM = useRef();
  useEffect(() => {
    emailInputDOM.current.focus();
    const queryParameters = new URLSearchParams(window.location.search);
    setRedirectLink(queryParameters.get("redirectLink"));
  }, []);

  function handleSignIn(e) {
    e.preventDefault();
    api.signIn(email, password, setErrorMessage, (sessionId) => {
      api.getUserDetails((userInfo) => {
        handleSuccessfulSignIn(userInfo);
      });
    });
  }

  return (
    <s.PageBackground>
      <s.LogoOnTop />

      <s.NarrowFormContainer>
        <form action="" method="post">
          <s.FormTitle>{strings.login}</s.FormTitle>

          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="inputField">
            <label>{strings.email}</label>
            <input
              type="email"
              className="field"
              id="email"
              name="email"
              placeholder={strings.email}
              background-color="#FFFFFF"
              ref={emailInputDOM}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputField">
            <label>{strings.password}</label>
            <input
              type="password"
              className="field"
              id="password"
              name="password"
              placeholder={strings.password}
              background-color="#FFFFFF"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="inputField">
            <s.FormButton
              onClick={handleSignIn}
              name="login"
              value="Login"
              className="loginButton"
            >
              {strings.login}
            </s.FormButton>
          </div>

          <p>
            {strings.alternativelyYouCan}{" "}
            <a className="links" href="create_account">
              {strings.createAnAccount}
            </a>{" "}
            {strings.or}{" "}
            <a className="links" href="/reset_pass">
              {strings.resetYourPassword}
            </a>
            .
          </p>
        </form>
      </s.NarrowFormContainer>
    </s.PageBackground>
  );
}
