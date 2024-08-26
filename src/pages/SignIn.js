import { useState } from "react";
import useRedirectLink from "../hooks/useRedirectLink";

import useFormField from "../hooks/useFormField";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import FullWidthErrorMsg from "./info_page_shared/FullWidthErrorMsg";
import InputField from "../components/InputField";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";

import strings from "../i18n/definitions";
import LocalStorage from "../assorted/LocalStorage";

export default function SignIn({ api, handleSuccessfulSignIn }) {
  // TODO: Fix this bug in a different way. Requires understanding why strings._language changes to "da" without it being asked to, whenever this component renders. Perhaps it imports an un-updated version of strings?
  strings.setLanguage(LocalStorage.getUiLanguage().code);

  const [email, handleEmailChange] = useFormField("");
  const [password, handlePasswordChange] = useFormField("");

  const [errorMessage, setErrorMessage] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    api.signIn(email, password, setErrorMessage, (sessionId) => {
      api.getUserDetails((userInfo) => {
        handleSuccessfulSignIn(userInfo, sessionId);
      });
    });
  }

  return (
    <InfoPage pageWidth={"narrow"}>
      <Header>
        <Heading>Log in</Heading>
      </Header>
      <Main>
        <Form action={""} method={"post"}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
            />

            <InputField
              type={"Password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              helperText={<a href="/reset_pass">{strings.forgotPassword}</a>}
            />
          </FormSection>
        </Form>
      </Main>
      <ButtonContainer className={"padding-medium"}>
        <Button className={"full-width-btn"} onClick={handleSignIn}>
          {strings.login}
        </Button>
      </ButtonContainer>
      <Footer>
        <p>
          {strings.dontHaveAnAccount + " "}
          <a className="bold underlined-link" href="/language_preferences">
            {strings.getStarted}
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
