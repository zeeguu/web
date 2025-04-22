import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import useFormField from "../hooks/useFormField";
import { EmailValidator, NonEmptyValidator } from "../utils/ValidatorRule/Validator";
import strings from "../i18n/definitions";
import PreferencesPage from "./_pages_shared/PreferencesPage";
import Header from "./_pages_shared/Header";
import Heading from "./_pages_shared/Heading.sc";
import Main from "./_pages_shared/Main.sc";
import Footer from "./_pages_shared/Footer.sc";

import ResetPasswordStep1 from "./ResetPasswordStep1";
import ResetPasswordStep2 from "./ResetPasswordStep2";

import { setTitle } from "../assorted/setTitle";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";

export default function ResetPassword() {
  const { userDetails } = useContext(UserContext);
  const api = useContext(APIContext);
  const loggedInEmail = "email" in userDetails ? userDetails.email : "";
  const isLoggedIn = loggedInEmail !== "";

  const [email, setEmail, validateEmail, isEmailValid, emailErrorMsg] = useFormField(loggedInEmail, [
    NonEmptyValidator("Please provide an email."),
    EmailValidator,
  ]);
  const [codeSent, setCodeSent] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      api.sendCode(
        loggedInEmail,
        () => {
          emailSent();
        },
        () => {
          console.error("Something went wrong...");
        },
      );
    }
  }, [loggedInEmail]);

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
        {!codeSent && !isLoggedIn && (
          <ResetPasswordStep1
            email={email}
            setEmail={setEmail}
            validateEmail={validateEmail}
            isEmailValid={isEmailValid}
            emailErrorMsg={emailErrorMsg}
            notifyEmailSent={emailSent}
          />
        )}

        {codeSent && <ResetPasswordStep2 email={email} isLoggedIn={isLoggedIn} />}
      </Main>
      <Footer>
        {!isLoggedIn && (
          <p className="centered">
            {strings.rememberPassword + " "}
            <Link className="bold underlined-link" to="/log_in">
              {strings.login}
            </Link>
          </p>
        )}
      </Footer>
    </PreferencesPage>
  );
}
