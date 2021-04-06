import * as s from "../components/FormPage.sc";
import { useState } from "react";
import validator from "../assorted/validator";
import strings from "../i18n/definitions"

export default function ResetPasswordStep2({ api, email }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  let validatorRules = [
    [newPass.length < 4, strings.passwordMustBeMsg],
    [code === "", strings.plsProvideCode],
  ];

  function handleResetPassword(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    api.resetPassword(
      email,
      code,
      newPass,
      () => {
        setSuccess(true);
      },
      (e) => {
        console.log(e);
        setFailure(true);
      }
    );
  }

  if (failure) {
    return (
      <>
        <h1>{strings.somethingWentWrong}</h1>
        <p>
          {strings.youCanTryTo}<a href="/reset_pass">{strings.resetYourPassword}</a> {strings.again}
        </p>

        <p>
          {strings.orContactUsAt} <b>zeeguu.team@gmail.com</b>
        </p>
      </>
    );
  }
  if (success) {
    return (
      <>
        <h1>{strings.success}</h1>
        <p>{strings.passwordChangedSuccessfullyMsg}</p>
        <br />
        <p>
          {strings.youCanGoTo}<a href="signin">{strings.login}</a> {strings.now}
        </p>
      </>
    );
  }

  return (
    <form action="" method="post">
      <s.FormTitle>{strings.resetPassword}</s.FormTitle>

      <p>
        {strings.plsCheck} <b>{email}</b> {strings.forCode}
      </p>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="inputField">
        <label>{strings.code}</label>
        <input
          placeholder={strings.codeReceived}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="inputField">
        <label>{strings.newPassword}</label>
        <input
          placeholder={strings.newPassword}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
      </div>

      <div className="inputField">
        <s.FormButton onClick={handleResetPassword} className="loginButton">
          {strings.setNewPassword}
        </s.FormButton>
      </div>
    </form>
  );
}
