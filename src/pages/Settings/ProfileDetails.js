import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import Form from "../_pages_shared/Form";
import FormSection from "../_pages_shared/FormSection";
import { Button } from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer";
import InputField from "../../components/InputField";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import BackArrow from "./settings_pages_shared/BackArrow";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg";

import LoadingAnimation from "../../components/LoadingAnimation";
import LogOutButton from "./LogOutButton";
import useFormField from "../../hooks/useFormField";
import {
  EmailValidation,
  NotEmptyValidationWithMsg,
} from "../../utils/ValidateRule/ValidateRule";
import validator from "../../assorted/validator";

export default function ProfileDetails({ api, setUser }) {
  const [userDetails, setUserDetails] = useState("");
  const [
    userName,
    setUserName,
    validateUserName,
    isUserNameValid,
    userErrorMessage,
  ] = useFormField("", NotEmptyValidationWithMsg("Please provide a name."));
  const [
    userEmail,
    setUserEmail,
    validateEmail,
    isEmailValid,
    emailErrorMessage,
  ] = useFormField("", [
    NotEmptyValidationWithMsg("Please provide an email."),
    EmailValidation,
  ]);

  const [errorMessage, setErrorMessage] = useState("");

  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    api.getUserDetails((data) => {
      setUserDetails(data);
      setUserEmail(data.email);
      setUserName(data.name);
    });
  }, [user.session, api]);

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);
    setUser({
      ...user,
      name: info.name,
    });

    saveUserInfoIntoCookies(info);
  }

  function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");
    let isFormValid = validator([validateUserName, validateEmail]);
    if (isFormValid)
      api.saveUserDetails(userDetails, setErrorMessage, () => {
        updateUserInfo(userDetails);
        history.goBack();
      });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.profileDetails}</Heading>
      </Header>
      <Main>
        <Form>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.name}
              id={"name"}
              name={"name"}
              placeholder={strings.name}
              value={userName}
              isError={!isUserNameValid}
              errorMessage={userErrorMessage}
              onChange={(e) => {
                setUserDetails({ ...userDetails, name: e.target.value });
                setUserName(e.target.value);
              }}
            />
            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.email}
              value={userEmail}
              isError={!isEmailValid}
              errorMessage={emailErrorMessage}
              onChange={(e) => {
                setUserDetails({ ...userDetails, email: e.target.value });
                setUserEmail(e.target.value);
              }}
            />
          </FormSection>
          <ButtonContainer className={"adaptive-alignment-horizontal"}>
            <Button type={"submit"} onClick={handleSave}>
              {strings.save}
            </Button>
          </ButtonContainer>
        </Form>
        <ButtonContainer className={"adaptive-alignment-horizontal"}>
          <LogOutButton />
        </ButtonContainer>
      </Main>
    </PreferencesPage>
  );
}
