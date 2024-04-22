import { useState } from "react";
import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import InputField from "./info_page_shared/InputField";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";

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
      },
    );
  }

  if (failure) {
    return (
      <>
        <h1>{strings.somethingWentWrong}</h1>
        <p>
          {strings.youCanTryTo}
          <a href="/reset_pass">{strings.resetYourPassword}</a> {strings.again}
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
          {strings.youCanGoTo}
          <a href="signin">{strings.login}</a> {strings.now}
        </p>
      </>
    );
  }

  return (
    <Form action={""} method={"post"}>
      <FormSection>
        <p>
          {strings.plsCheck} <b>{email}</b> {strings.forCode}
        </p>

        {errorMessage && <div className="error">{errorMessage}</div>}

        <InputField
          id={"received-code"}
          label={"Received code"}
          name={"received-code"}
          placeholder={"Enter the code"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <InputField
          id={"new-password"}
          label={"New password"}
          name={"new-password"}
          placeholder={"Must be at least 4 characters long"}
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
      </FormSection>

      <ButtonContainer>
        <Button onClick={handleResetPassword}>Set New Password</Button>
      </ButtonContainer>
    </Form>
  );
}
