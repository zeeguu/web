import { useState, useEffect } from "react";
import validator from "../assorted/validator";
import strings from "../i18n/definitions";

import useFormField from "../hooks/useFormField";

import Form from "./_pages_shared/Form";
import FormSection from "./_pages_shared/FormSection";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg";
import InputField from "../components/InputField";
import ButtonContainer from "./_pages_shared/ButtonContainer";
import { Button } from "./_pages_shared/Button.sc";
import {
  LongerThanNValidation,
  NotEmptyValidationWithMsg,
} from "../utils/ValidateRule/ValidateRule";
import { scrollToTop } from "../utils/misc/scrollToTop";

export default function ResetPasswordStep2({ api, email }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const [
    sentCode,
    setsentCode,
    validatesentCode,
    issentCodeValid,
    sentCodeMsg,
  ] = useFormField("", [
    NotEmptyValidationWithMsg("Please insert the code sent to your email."),
  ]);

  // strings.plsProvideCode

  const [newPass, setNewPass, validateNewPass, isNewPassValid, newPassMsg] =
    useFormField("", [
      NotEmptyValidationWithMsg("You must provide a new password."),
      LongerThanNValidation(3, strings.passwordMustBeMsg),
    ]);

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  function handleResetPassword(e) {
    e.preventDefault();
    // If users have the same error, there wouldn't be a scroll.
    setErrorMessage("");

    if (!validator([validatesentCode, validateNewPass])) {
      return;
    }

    api.resetPassword(
      email,
      sentCode,
      newPass,
      () => {
        setSuccess(true);
      },
      (e) => {
        console.log(e);
        setFailure(true);
        setErrorMessage("Something went wrong, please contact us.");
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
          {strings.orContactUsAt} <b>{strings.zeeguuTeamEmail}</b>
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
        {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}

        <InputField
          id={"received-code"}
          label={strings.codeReceived}
          name={"received-code"}
          placeholder={strings.codeReceivedPlaceholder}
          value={sentCode}
          isError={!issentCodeValid}
          errorMessage={sentCodeMsg}
          onChange={(e) => {
            setsentCode(e.target.value);
          }}
        />

        <InputField
          id={"new-password"}
          label={strings.newPassword}
          name={"new-password"}
          placeholder={strings.newPasswordPlaceholder}
          value={newPass}
          isError={!isNewPassValid}
          errorMessage={newPassMsg}
          onChange={(e) => {
            setNewPass(e.target.value);
          }}
          helperText={strings.passwordHelperText}
        />
      </FormSection>

      <ButtonContainer className={"padding-medium"}>
        <Button
          type={"submit"}
          className={"full-width-btn"}
          onClick={handleResetPassword}
        >
          {strings.setNewPassword}
        </Button>
      </ButtonContainer>
    </Form>
  );
}
