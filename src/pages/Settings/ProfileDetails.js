import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";
import LocalStorage from "../../assorted/LocalStorage";
import strings from "../../i18n/definitions";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import InputField from "../../components/InputField";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import LoadingAnimation from "../../components/LoadingAnimation";
import LogOutButton from "./LogOutButton";
import useFormField from "../../hooks/useFormField";
import {
  EmailValidator,
  NonEmptyValidator,
} from "../../utils/ValidatorRule/Validator";
import validateRules from "../../assorted/validateRules";
import { is } from "date-fns/locale";

export default function ProfileDetails() {
  const api = useContext(APIContext);
  const [errorMessage, setErrorMessage] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const history = useHistory();
  const isPageMounted = useRef(true);

  const [tempUserDetails, setTempUserDetails] = useState("");
  const [
    userName,
    setUserName,
    validateUserName,
    isUserNameValid,
    userErrorMessage,
  ] = useFormField("", NonEmptyValidator("Please provide a name."));
  const [
    userEmail,
    setUserEmail,
    validateEmail,
    isEmailValid,
    emailErrorMessage,
  ] = useFormField("", [
    NonEmptyValidator("Please provide an email."),
    EmailValidator,
  ]);

  useEffect(() => {
    setTitle(strings.profileDetails);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;
    api.getUserDetails((data) => {
      if (isPageMounted.current) {
        setTempUserDetails(data);
        setUserEmail(data.email);
        setUserName(data.name);
      }
    });

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [userDetails, api]);

  function updateUserInfo(info) {
    const newUserDetails = {
      ...userDetails,
      name: info.name,
    };
    setUserDetails(newUserDetails);
    LocalStorage.setUserInfo(info);
    saveUserInfoIntoCookies(info);
  }

  function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!validateRules([validateUserName, validateEmail])) return;
    api.saveUserDetails(tempUserDetails, setErrorMessage, () => {
      updateUserInfo(tempUserDetails);
      history.goBack();
    });
  }

  if (!tempUserDetails) {
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
                setTempUserDetails({
                  ...tempUserDetails,
                  name: e.target.value,
                });
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
                setTempUserDetails({
                  ...tempUserDetails,
                  email: e.target.value,
                });
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
