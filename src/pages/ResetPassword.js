import { useState } from "react";

import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading";
import Main from "./_pages_shared/Main";
import Footer from "./_pages_shared/Footer";

import useFormField from "../hooks/useFormField";
import {
  EmailValidation,
  NotEmptyValidationWithMsg,
} from "../utils/ValidateRule/ValidateRule";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

import strings from "../i18n/definitions";

export default function ResetPassword({ api }) {
  const [email, setEmail, validateEmail, isEmailValid, emailErrorMsg] =
    useFormField("", [
      NotEmptyValidationWithMsg("Please provide an email."),
      EmailValidation,
    ]);
  const [codeSent, setCodeSent] = useState(false);

  function emailSent() {
    setCodeSent(true);
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>Reset Password</Heading>
      </Header>
      <Main>
        {!codeSent && (
          <ResetPasswordStep1
            api={api}
            email={email}
            setEmail={setEmail}
            validateEmail={validateEmail}
            isEmailValid={isEmailValid}
            emailErrorMsg={emailErrorMsg}
            notifyEmailSent={emailSent}
          />
        )}

        {codeSent && <ResetPasswordStep2 api={api} email={email} />}
      </Main>
      <Footer>
        <p className="centered">
          {strings.rememberPassword + " "}
          <a className="bold underlined-link" href="login">
            {strings.login}
          </a>
        </p>
      </Footer>
    </PreferencesPage>
  );
}
