import { useState, useEffect } from "react";
import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import Form from "./_pages_shared/Form.sc";
import FormSection from "./_pages_shared/FormSection.sc";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import InputField from "../components/InputField";
import ButtonContainer from "./_pages_shared/ButtonContainer.sc";
import Button from "./_pages_shared/Button.sc";
import { scrollToTop } from "../utils/misc/scrollToTop";

export default function ResetPasswordStep1({
  api,
  email,
  setEmail,
  validateEmail,
  isEmailValid,
  emailErrorMsg,
  notifyEmailSent,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  function handleResetPassword(e) {
    e.preventDefault();

    if (!validator([validateEmail])) {
      return;
    }

    api.sendCode(
      email,
      () => {
        notifyEmailSent();
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
          isError={!isEmailValid}
          errorMessage={emailErrorMsg}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
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
