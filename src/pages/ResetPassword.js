import { useState, useEffect } from "react";

import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading";
import Main from "./_pages_shared/Main";
import Footer from "./_pages_shared/Footer";

import useFormField from "../hooks/useFormField";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

import strings from "../i18n/definitions";
import { setTitle } from "../assorted/setTitle";

export default function ResetPassword({ api }) {
  const [email, handleEmailChange] = useFormField("");
  const [codeSent, setCodeSent] = useState(false);

  function validEmail() {
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
            handleEmailChange={handleEmailChange}
            notifyOfValidEmail={validEmail}
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
