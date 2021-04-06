import * as s from "../components/FormPage.sc";
import { useState } from "react";
import * as EmailValidator from "email-validator";
import validator from "../assorted/validator";
import strings from "../i18n/definitions"

export default function ResetPasswordStep1({
  api,
  email,
  setEmail,
  notifyOfValidEmail,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  let validatorRules = [
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
  ];

  function handleResetPassword(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    api.sendCode(
      email,
      () => {
        notifyOfValidEmail();
      },
      () => {
        setErrorMessage("inexistent email");
      }
    );
  }
  return (
    <form action="" method="post">
      <s.FormTitle>{strings.resetPassword}</s.FormTitle>

      <p>{strings.weNeedTheEmailMsg}</p>
      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="inputField">
        <label>{strings.email}</label>
        <input
          type="email"
          name="email"
          placeholder={strings.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="inputField">
        <s.FormButton
          onClick={handleResetPassword}
          name="login"
          value="Login"
          className="loginButton"
        >
          {strings.resetPassword}
        </s.FormButton>
      </div>
    </form>
  );
}
