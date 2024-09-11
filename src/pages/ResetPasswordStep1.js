import { useState } from "react";
import * as EmailValidator from "email-validator";
import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import Form from "./_pages_shared/Form";
import FormSection from "./_pages_shared/FormSection";
import FullWidthErrorMsg from "./_pages_shared/FullWidthErrorMsg";
import InputField from "../components/InputField";
import ButtonContainer from "./_pages_shared/ButtonContainer";
import Button from "./_pages_shared/Button";

export default function ResetPasswordStep1({
  api,
  email,
  handleEmailChange,
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
      },
    );
  }

  return (
    <Form action={""} method={"post"}>
      <FormSection>
        <p>
          Please enter the email address you used to create your account
          on&nbsp;Zeeguu
        </p>
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

        <InputField
          id={"email"}
          label={strings.email}
          type={"email"}
          name={"email"}
          placeholder={strings.emailPlaceholder}
          value={email}
          onChange={handleEmailChange}
        />
      </FormSection>
      <ButtonContainer className={"padding-medium"}>
        <Button
          type={"submit"}
          className={"full-width-btn"}
          onClick={handleResetPassword}
        >
          {strings.resetPassword}
        </Button>
      </ButtonContainer>
    </Form>
  );
}
