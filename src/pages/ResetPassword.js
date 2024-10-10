import { useState, useEffect } from "react";

import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading.sc";
import Main from "./_pages_shared/Main.sc";
import Footer from "./_pages_shared/Footer.sc";

import useFormField from "../hooks/useFormField";
import {
  EmailValidator,
  NonEmptyValidation,
} from "../utils/ValidatorRule/ValidatorRule";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

import strings from "../i18n/definitions";
import { setTitle } from "../assorted/setTitle";

export default function ResetPassword({ api }) {
  const [email, setEmail, validateEmail, isEmailValid, emailErrorMsg] =
    useFormField("", [
      NonEmptyValidation("Please provide an email."),
      EmailValidator,
    ]);
  const [codeSent, setCodeSent] = useState(false);

  function emailSent() {
    setCodeSent(true);
  }

  useEffect(() => {
    setTitle(strings.resetPassword);
  }, []);

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
          <a className="bold underlined-link" href="log_in">
            {strings.login}
          </a>
        </p>
      </Footer>
    </PreferencesPage>
  );
}
