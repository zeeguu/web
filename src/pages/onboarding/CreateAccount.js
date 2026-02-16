import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import useFormField from "../../hooks/useFormField";
import { UserContext } from "../../contexts/UserContext";
import { APIContext } from "../../contexts/APIContext";
import { saveSharedUserInfo } from "../../utils/cookies/userInfo";
import LocalStorage from "../../assorted/LocalStorage";
import {
  EmailValidator,
  MinimumLengthValidator,
  NonEmptyValidator,
  Validator,
} from "../../utils/ValidatorRule/Validator";
import { setTitle } from "../../assorted/setTitle";
import validateRules from "../../assorted/validateRules";
import strings from "../../i18n/definitions";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import InputField from "../../components/InputField";
import useShadowRef from "../../hooks/useShadowRef";
import Footer from "../_pages_shared/Footer.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import Modal from "../../components/modal_shared/Modal";

import * as sC from "../../components/modal_shared/Checkbox.sc";
import * as sI from "../../components/InputField.sc";

export default function CreateAccount({ handleSuccessfulLogIn }) {
  const api = useContext(APIContext);
  const history = useHistory();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const learnedLanguage = LocalStorage.getLearnedLanguage();
  const nativeLanguage = LocalStorage.getNativeLanguage();
  const learnedCefrLevel = LocalStorage.getLearnedCefrLevel();

  const [inviteCode, setInviteCode] = useFormField("", []);

  const [name, setName, validateName, isNameValid, nameMsg] = useFormField("", [
    NonEmptyValidator("Please enter a name."),
  ]);
  const [email, setEmail, validateEmail, isEmailValid, emailMsg] = useFormField("", [
    NonEmptyValidator("Please enter an e-mail."),
    EmailValidator,
  ]);
  const [password, setPassword, validatePassword, isPasswordValid, passwordMsg] = useFormField("", [
    NonEmptyValidator("Please enter a password."),
    MinimumLengthValidator(3, strings.passwordMustBeMsg),
  ]);

  const passwordRef = useShadowRef(password);

  const [confirmPass, setConfirmPass, validateConfirmPass, isConfirmPassValid, confirmPassMsg] = useFormField("", [
    NonEmptyValidator("Please re-enter your password."),
    new Validator((v) => {
      return v === passwordRef.current;
    }, "Passwords must match."),
  ]);

  const [
    checkPrivacyNote,
    setCheckPrivacyNote,
    validateCheckPrivacyNote,
    isCheckPrivacyNoteValid,
    checkPrivacyNoteMsg,
  ] = useFormField(
    false,
    new Validator((v) => {
      return v === true;
    }, strings.plsAcceptPrivacyPolicy),
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [privacyNoticeText, setPrivacyNoticeText] = useState([]);

  useState(() => {
    fetch("https://raw.githubusercontent.com/zeeguu/browser-extension/main/PRIVACY.md").then((response) => {
      response.text().then((privacyText) => {
        let text = privacyText
          .split("==============")[1]
          .split("\n\n")
          .filter((text) => text !== "");
        setPrivacyNoticeText(text);
      });
    });
  }, []);

  useEffect(() => {
    setTitle(strings.createAccount);
  }, []);

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  function handleCreate(e) {
    e.preventDefault();
    // If users have the same error, there wouldn't be a scroll.
    setErrorMessage("");
    if (
      !validateRules([
        validateName,
        validatePassword,
        validateEmail,
        validateCheckPrivacyNote,
        validateConfirmPass,
      ])
    ) {
      scrollToTop();
      return;
    }

    let userInfo = {
      ...userDetails,
      name: name,
      email: email,
      learned_language: learnedLanguage,
      learned_cefr_level: learnedCefrLevel,
      native_language: nativeLanguage,
    };

    api.addUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        api.getUserDetails((user) => {
          handleSuccessfulLogIn(user, session, false);
          setUserDetails(userInfo);
          saveSharedUserInfo(userInfo);
          // Redirect to email verification instead of select_interests
          history.push("/verify_email");
        });
      },
      (error) => {
        setErrorMessage(error);
      },
    );
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Modal
        open={showPrivacyNotice}
        onClose={() => {
          setShowPrivacyNotice(false);
        }}
      >
        <>
          <h1>Privacy Notice</h1>
          {privacyNoticeText.map((par, i) => (
            <div key={i}>
              <p>{par}</p>
              <br />
            </div>
          ))}
        </>
      </Modal>
      <Header>
        <Heading>Create Account</Heading>
      </Header>
      <Main>
        <Form action={""} method={"POST"}>
          {errorMessage && <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.inviteCode + " (optional)"}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.inviteCodePlaceholder}
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value);
              }}
              helperText={
                <div>
                  Only needed if you received one from a teacher or researcher.
                </div>
              }
            />

            <InputField
              type={"text"}
              label={strings.fullName}
              id={"name"}
              name={"name"}
              placeholder={strings.fullNamePlaceholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              isError={!isNameValid}
              errorMessage={nameMsg}
            />

            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.emailPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              isError={!isEmailValid}
              errorMessage={emailMsg}
            />

            <InputField
              type={"password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              helperText={strings.passwordHelperText}
              isError={!isPasswordValid || !isConfirmPassValid}
              errorMessage={passwordMsg}
            />

            <InputField
              type={"password"}
              label={strings.passwordConfirm}
              id={"passwordConfirm"}
              name={"passwordConfirm"}
              placeholder={strings.passwordConfirmPlaceholder}
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
              }}
              isError={!isConfirmPassValid}
              errorMessage={confirmPassMsg}
            />
          </FormSection>
          <sC.CheckboxWrapper>
            <input
              onChange={(e) => {
                setCheckPrivacyNote(e.target.checked);
              }}
              checked={checkPrivacyNote}
              id="checkbox"
              name=""
              value=""
              type="checkbox"
            ></input>
            <label>
              By checking this box you agree to our &nbsp;
              <span
                className="link-style"
                onClick={() => {
                  setShowPrivacyNotice(true);
                }}
              >
                {strings.privacyNotice}
              </span>
              {!isCheckPrivacyNoteValid && <sI.ErrorMessage>{checkPrivacyNoteMsg}</sI.ErrorMessage>}
            </label>
          </sC.CheckboxWrapper>
          <ButtonContainer className={"padding-medium"}>
            <Button type={"submit"} className={"full-width-btn"} onClick={handleCreate}>
              {strings.createAccount}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p className="centered">
          {strings.alreadyHaveAccount + " "}
          <Link className="bold underlined-link" to="/log_in">
            {strings.login}
          </Link>
        </p>
      </Footer>
    </PreferencesPage>
  );
}
