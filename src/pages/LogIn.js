import { useEffect, useState } from "react";

import useFormField from "../hooks/useFormField";

import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading";
import Main from "./_pages_shared/Main";
import Form from "./_pages_shared/Form";
import FormSection from "./_pages_shared/FormSection";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg";
import InputField from "../components/InputField";
import Footer from "./_pages_shared/Footer";
import ButtonContainer from "./_pages_shared/ButtonContainer";
import { Button } from "./_pages_shared/Button.sc";

import strings from "../i18n/definitions";
import LocalStorage from "../assorted/LocalStorage";
import {
  NotEmptyValidationWithMsg,
  EmailValidation,
} from "../utils/ValidateRule/ValidateRule";
import validator from "../assorted/validator";
import { scrollToTop } from "../utils/misc/scrollToTop";
import { setTitle } from "../assorted/setTitle";

export default function LogIn({ api, handleSuccessfulLogIn }) {
  strings.setLanguage(LocalStorage.getUiLanguage().code);

  const [email, setEmail, validateEmail, isEmailValid, emailErrorMsg] =
    useFormField("", [
      NotEmptyValidationWithMsg("Please provide an email."),
      EmailValidation,
    ]);
  const [
    password,
    setPassword,
    validatePassword,
    isPasswordValid,
    passwordErrorMsg,
  ] = useFormField(
    "",
    NotEmptyValidationWithMsg("Please enter your password."),
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    scrollToTop();
  }, [errorMessage]);

  useEffect(() => {
    setTitle(strings.login);
  }, []);

  function handleLogIn(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!validator([validateEmail, validatePassword])) return;
    api.logIn(email, password, setErrorMessage, (sessionId) => {
      api.getUserDetails((userInfo) => {
        handleSuccessfulLogIn(userInfo, sessionId);
      });
    });
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
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
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              isError={!isEmailValid}
              errorMessage={emailErrorMsg}
            />

            <InputField
              type={"Password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              isError={!isPasswordValid}
              errorMessage={passwordErrorMsg}
              helperText={<a href="/reset_pass">{strings.forgotPassword}</a>}
            />
          </FormSection>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={handleLogIn}
            >
              {strings.login}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p className="centered">
          {strings.dontHaveAnAccount + " "}
          <a className="bold underlined-link" href="/language_preferences">
            {strings.getStarted}
          </a>
        </p>
      </Footer>
    </PreferencesPage>
  );
}
