import { useState, useRef } from "react";
import useRedirectLink from "../hooks/useRedirectLink";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import InputField from "./info_page_shared/InputField";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";

import strings from "../i18n/definitions";
import LocalStorage from "../assorted/LocalStorage";

export default function SignIn({ api, handleSuccessfulSignIn }) {
  // TODO: Fix this bug in a different way. Requires understanding why strings._language changes to "da" without it being asked to, whenever this component renders. Perhaps it imports an un-updated version of strings?
  strings.setLanguage(LocalStorage.getUiLanguage().code);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let { handleRedirectLinkOrGoTo } = useRedirectLink();

  let emailInputDOM = useRef();

  // useEffect(() => {
  //   emailInputDOM.current.focus();
  // }, []);

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
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>Log in</Heading>
      </Header>
      <Main>
        <Form action={""} method={"post"}>
          {errorMessage && <div className="error">{errorMessage}</div>}
          <FormSection>
            <InputField
              type={"email"}
              label={"Email"}
              id={"email"}
              name={"email"}
              placeholder={"example@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              type={"Password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={"Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperLink={"Forgot password?"}
              helperLinkHref={"/reset_pass"}
            />
          </FormSection>
          <ButtonContainer>
            <Button onClick={handleSignIn}>Log in</Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p>
          Don't have an account?{" "}
          <a className="links" href="create_account">
            <b>Register</b>
          </a>{" "}
        </p>
      </Footer>
    </InfoPage>
  );
}
