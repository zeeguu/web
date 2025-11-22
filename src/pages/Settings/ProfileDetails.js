import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo";
import { setTitle } from "../../assorted/setTitle";
import { APIContext } from "../../contexts/APIContext";
import { Link } from "react-router-dom";
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
import useFormField from "../../hooks/useFormField";
import { EmailValidator, NonEmptyValidator } from "../../utils/ValidatorRule/Validator";
import validateRules from "../../assorted/validateRules";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import FullWidthConfirmMsg from "../../components/FullWidthConfirmMsg.sc";

export default function ProfileDetails() {
  const api = useContext(APIContext);
  const state = useLocation().state || {};
  const successfulyChangedPassword = "passwordChanged" in state ? state.passwordChanged : false;
  const [errorMessage, setErrorMessage] = useState("");
  const { userDetails, setUserDetails } = useContext(UserContext);
  const history = useHistory();
  const isPageMounted = useRef(true);

  const [userName, setUserName, validateUserName, isUserNameValid, userErrorMessage] = useFormField(
    "",
    NonEmptyValidator("Please provide a name."),
  );
  const [userEmail, setUserEmail, validateEmail, isEmailValid, emailErrorMessage] = useFormField("", [
    NonEmptyValidator("Please provide an email."),
    EmailValidator,
  ]);

  useEffect(() => {
    setTitle(strings.profileDetails);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;
    if (isPageMounted.current) {
      setUserEmail(userDetails.email);
      setUserName(userDetails.name);
    }

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [userDetails, api]);

  function handleSave(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!validateRules([validateUserName, validateEmail])) return;

    const newUserDetails = {
      ...userDetails,
      name: userName,
      email: userEmail,
    };
    api.saveUserDetails(newUserDetails, setErrorMessage, () => {
      setUserDetails(newUserDetails);
      LocalStorage.setUserInfo(newUserDetails);
      saveSharedUserInfo(newUserDetails);
      history.push("/account_settings");
    });
  }

  if (!userDetails) {
    return <LoadingAnimation />;
  }
  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow redirectLink={"/account_settings"} />
      <Header withoutLogo>
        <Heading>{strings.profileDetails}</Heading>
        {successfulyChangedPassword && (
          <>
            <FullWidthConfirmMsg>Password changed successfuly!</FullWidthConfirmMsg>
          </>
        )}
      </Header>
      <Main>
        <Form>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
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
                setUserEmail(e.target.value);
              }}
            />

            <Link
              to={{
                pathname: "/reset_pass",
                state: { profileEmail: userEmail },
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
    </PreferencesPage>
  );
}
