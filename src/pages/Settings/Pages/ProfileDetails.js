import { Link, useHistory } from "react-router-dom";
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { saveSharedUserInfo } from "../../../utils/cookies/userInfo";
import { setTitle } from "../../../assorted/setTitle";
import { APIContext } from "../../../contexts/APIContext";
import LocalStorage from "../../../assorted/LocalStorage";
import strings from "../../../i18n/definitions";
import Form from "../../_pages_shared/Form.sc";
import FormSection from "../../_pages_shared/FormSection.sc";
import Button from "../../_pages_shared/Button.sc";
import ButtonContainer from "../../_pages_shared/ButtonContainer.sc";
import InputField from "../../../components/InputField";
import CardPage from "../../_pages_shared/CardPage";
import Main from "../../_pages_shared/Main.sc";
import SettingsPageHeader from "../SharedComponents/SettingsPageHeader";
import FullWidthErrorMsg from "../../../components/FullWidthErrorMsg.sc";
import LoadingAnimation from "../../../components/LoadingAnimation";
import useFormField from "../../../hooks/useFormField";
import { NonEmptyOrWhitespaceOnlyValidator } from "../../../utils/ValidatorRule/Validator";
import validateRules from "../../../assorted/validateRules";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import FullWidthConfirmMsg from "../../../components/FullWidthConfirmMsg.sc";
import Feature from "../../../features/Feature";

export default function ProfileDetails() {
  const api = useContext(APIContext);
  const isGamificationEnabled = Feature.has_gamification();
  const state = useLocation().state || {};
  const fallbackRedirectPath = isGamificationEnabled ? "/profile" : "/account_settings";
  const redirectPath = ["/profile", "/account_settings"].includes(state.from) ? state.from : fallbackRedirectPath;
  const successfullyChangedPassword = "passwordChanged" in state ? state.passwordChanged : false;
  const successfullyChangedEmail = "emailChanged" in state ? state.emailChanged : false;
  const [errorMessage, setErrorMessage] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const history = useHistory();
  const isPageMounted = useRef(true);

  const default_error_message = "Unable to save profile details. Please try again.";

  const [displayName, setDisplayName, validateDisplayName, isDisplayNameValid, displayNameErrorMessage] = useFormField(
    "",
    NonEmptyOrWhitespaceOnlyValidator("Please provide a display name."),
  );
  const [username, setUsername, validateUsername, isUsernameValid, usernameErrorMessage] = useFormField(
    "",
    NonEmptyOrWhitespaceOnlyValidator("Please provide a username."),
  );

  useEffect(() => {
    setTitle(strings.profileDetails);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;
    if (isPageMounted.current) {
      setDisplayName(userDetails.name);
      setUsername(userDetails.username);
    }

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [userDetails, api]);

  function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!validateRules([validateDisplayName, validateUsername])) return;

    const updatedFormValues = {
      name: displayName.trim(),
      username: username.trim(),
    };
    const payload = {
      ...userDetails,
      ...updatedFormValues,
    };
    api.saveUserDetails(
      payload,
      (error) => setErrorMessage(error ?? default_error_message),
      () => {
        const newUserDetails = {
          ...userDetails,
          ...updatedFormValues,
        };
        setUserDetails(newUserDetails);
        LocalStorage.setUserInfo(newUserDetails);
        saveSharedUserInfo(newUserDetails);
        history.push(redirectPath);
      },
    );
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }
  return (
    <CardPage layoutVariant={"card-under-menu"} isTransparent reducedPadding>
      <SettingsPageHeader title={strings.profileDetails} redirectLink={redirectPath}>
        {successfullyChangedPassword && (
          <>
            <FullWidthConfirmMsg>Password changed successfully!</FullWidthConfirmMsg>
          </>
        )}
        {successfullyChangedEmail && <FullWidthConfirmMsg>Email changed to {userDetails.email}.</FullWidthConfirmMsg>}
      </SettingsPageHeader>
      <Main>
        <Form>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.displayName}
              id={"name"}
              name={"name"}
              placeholder={strings.displayNamePlaceholder}
              value={displayName}
              isError={!isDisplayNameValid}
              errorMessage={displayNameErrorMessage}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <InputField
              type={"text"}
              label={strings.username}
              id={"username"}
              name={"username"}
              placeholder={strings.usernamePlaceholder}
              value={username}
              isError={!isUsernameValid}
              errorMessage={usernameErrorMessage}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              value={userDetails.email}
              readOnly
              helperText={
                <Link to={{ pathname: "/account_settings/change_email", state: { from: redirectPath } }}>
                  Change email
                </Link>
              }
            />

            <Link
              to={{
                pathname: "/reset_pass",
                state: { profileEmail: userDetails.email },
              }}
            >
              Change password
            </Link>
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </CardPage>
  );
}
