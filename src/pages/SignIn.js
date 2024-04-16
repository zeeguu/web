import { useState, useRef, useEffect } from "react";
import useRedirectLink from "../hooks/useRedirectLink";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import Footer from "./info_page_shared/Footer";
import Button from "./info_page_shared/Button";

import strings from "../i18n/definitions";

import * as s from "../components/FormPage.sc";
import LocalStorage from "../assorted/LocalStorage";

export default function SignIn({ api, handleSuccessfulSignIn }) {
  // TODO: Fix this bug in a different way. Requires understanding why strings._language changes to "da" without it being asked to, whenever this component renders. Perhaps it imports an un-updated version of strings?
  strings.setLanguage(LocalStorage.getUiLanguage().code);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let { handleRedirectLinkOrGoTo } = useRedirectLink();

  let emailInputDOM = useRef();

  useEffect(() => {
    emailInputDOM.current.focus();
  }, []);

  function handleSignIn(e) {
    e.preventDefault();
    api.signIn(email, password, setErrorMessage, (sessionId) => {
      api.getUserDetails((userInfo) => {
        handleSuccessfulSignIn(userInfo);
        /* If a redirect link exists, uses it to redirect the user, 
        otherwise, uses the location from the function argument. */
        handleRedirectLinkOrGoTo("/articles");
      });
    });
  }

  return (
    <InfoPage>
      <Header>
        <Heading>Log in</Heading>
      </Header>
      <Main>
        <s.NarrowFormContainer>
          <Form action={""} method={"post"}>
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
              <Button onClick={handleSignIn}>Log in</Button>
            </div>
          </Form>
        </s.NarrowFormContainer>
      </Main>
      <Footer>
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
      </Footer>
    </InfoPage>
  );
}
