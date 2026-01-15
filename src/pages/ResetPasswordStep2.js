import { useState, useEffect, useContext } from "react";
import validateRules from "../assorted/validateRules";
import strings from "../i18n/definitions";

import useFormField from "../hooks/useFormField";

import Form from "./_pages_shared/Form.sc";
import FormSection from "./_pages_shared/FormSection.sc";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import InputField from "../components/InputField";
import ButtonContainer from "../pages/_pages_shared/ButtonContainer.sc";
import Button from "../pages/_pages_shared/Button.sc";
import { MinimumLengthValidator, NonEmptyValidator } from "../utils/ValidatorRule/Validator";
import { scrollToTop } from "../utils/misc/scrollToTop";
import { APIContext } from "../contexts/APIContext";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ResetPasswordStep2({ email, isLoggedIn }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const [sentCode, setsentCode, validatesentCode, issentCodeValid, sentCodeMsg] = useFormField("", [
    NonEmptyValidator("Please insert the code sent to your email."),
  ]);

  // strings.plsProvideCode

  const [newPass, setNewPass, validateNewPass, isNewPassValid, newPassMsg] = useFormField("", [
    NonEmptyValidator("You must provide a new password."),
    MinimumLengthValidator(3, strings.passwordMustBeMsg),
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

    if (!validateRules([validatesentCode, validateNewPass])) {
      return;
    }

    api.resetPassword(
      email,
      sentCode,
      newPass,
      () => {
        if (isLoggedIn)
          history.push({
            pathname: "/account_settings/profile_details",
            state: { passwordChanged: true },
          });
        setSuccess(true);
      },
      (e) => {
        console.log(e);
        setErrorMessage(e || "Something went wrong, please contact us.");
      },
    );
  }

  if (failure) {
    return (
      <>
        <h1>{strings.somethingWentWrong}</h1>
        <p>
          {strings.youCanTryTo}
          <Link to="/reset_pass">{strings.resetYourPassword}</Link> {strings.again}
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
          <Link to="/log_in">{strings.login}</Link> {strings.now}
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
          type="password"
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
        <Button type={"submit"} className={"full-width-btn"} onClick={handleResetPassword}>
          {strings.setNewPassword}
        </Button>
      </ButtonContainer>
    </Form>
  );
}
