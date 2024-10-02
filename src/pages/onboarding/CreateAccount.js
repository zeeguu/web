import { useState, useContext, useEffect } from "react";

import redirect from "../../utils/routing/routing";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import * as sC from "../../components/modal_shared/Checkbox.sc";
import useFormField from "../../hooks/useFormField";

import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import { Heading } from "../_pages_shared/Heading.sc";
import { Main } from "../_pages_shared/Main.sc";
import { Form } from "../_pages_shared/Form.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg";
import FormSection from "../_pages_shared/FormSection";
import InputField from "../../components/InputField";
import { Footer } from "../_pages_shared/Footer.sc";
import { ButtonContainer } from "../_pages_shared/ButtonContainer.sc";
import { Button } from "../_pages_shared/Button.sc";
import Modal from "../../components/modal_shared/Modal";
import validator from "../../assorted/validator";
import strings from "../../i18n/definitions";

import * as EmailValidator from "email-validator";
import LocalStorage from "../../assorted/LocalStorage";
import { setTitle } from "../../assorted/setTitle";

export default function CreateAccount({ api, handleSuccessfulLogIn, setUser }) {
  const user = useContext(UserContext);

  const learnedLanguage_OnRegister =
    LocalStorage.getLearnedLanguage_OnRegister();
  const nativeLanguage_OnRegister = LocalStorage.getNativeLanguage_OnRegister();
  const learnedCefrLevel_OnRegister =
    LocalStorage.getLearnedCefrLevel_OnRegister();

  const [learned_language_on_register] = useState(learnedLanguage_OnRegister);
  const [native_language_on_register] = useState(nativeLanguage_OnRegister);
  const [learned_cefr_level_on_register] = useState(
    learnedCefrLevel_OnRegister,
  );

  const [inviteCode, handleInviteCodeChange] = useFormField("");
  const [name, handleNameChange] = useFormField("");
  const [email, handleEmailChange] = useFormField("");
  const [password, handlePasswordChange] = useFormField("");
  const [checkPrivacyNote, handleCheckPrivacyNote] = useFormField(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [privacyNoticeText, setPrivacyNoticeText] = useState([]);

  let validatorRules = [
    [name === "", strings.nameIsRequired],
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
    [password.length < 4, strings.passwordMustBeMsg],
    [!checkPrivacyNote, strings.plsAcceptPrivacyPolicy],
  ];

  useState(() => {
    fetch(
      "https://raw.githubusercontent.com/zeeguu/browser-extension/main/PRIVACY.md",
    ).then((response) => {
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

  //Clear temp local storage entries needed only for account creation
  function clearOnRegisterLanguageEntries() {
    LocalStorage.removeLearnedLanguage_OnRegister();
    LocalStorage.removeCefrLevel_OnRegister();
    LocalStorage.removeNativeLanguage_OnRegister();
  }

  function handleCreate(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    let userInfo = {
      ...user,
      name: name,
      email: email,
      learned_language: learned_language_on_register,
      learned_cefr_level: learned_cefr_level_on_register,
      native_language: native_language_on_register,
    };

    api.addUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        api.getUserDetails((user) => {
          handleSuccessfulLogIn(user, session);
          setUser(userInfo);
          saveUserInfoIntoCookies(userInfo);
          clearOnRegisterLanguageEntries();
          redirect("/select_interests");
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
        <Heading>Create Beta&nbsp;Account</Heading>
      </Header>
      <Main>
        <Form action={""} method={"POST"}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <InputField
              type={"text"}
              label={strings.inviteCode}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.inviteCodePlaceholder}
              value={inviteCode}
              onChange={handleInviteCodeChange}
              helperText={
                <div>
                  No invite code? Request it at:{" "}
                  <span className="bold">{strings.zeeguuTeamEmail}</span>
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
              onChange={handleNameChange}
            />

            <InputField
              type={"email"}
              label={strings.email}
              id={"email"}
              name={"email"}
              placeholder={strings.emailPlaceholder}
              value={email}
              onChange={handleEmailChange}
            />

            <InputField
              type={"password"}
              label={strings.password}
              id={"password"}
              name={"password"}
              placeholder={strings.passwordPlaceholder}
              value={password}
              onChange={handlePasswordChange}
              helperText={strings.passwordHelperText}
            />
          </FormSection>
          <sC.CheckboxWrapper>
            <input
              onChange={handleCheckPrivacyNote}
              checked={checkPrivacyNote}
              id="checkbox"
              name=""
              value=""
              type="checkbox"
            ></input>
            <label>
              By checking this box you agree to our &nbsp;
              <a
                onClick={() => {
                  setShowPrivacyNotice(true);
                }}
              >
                {strings.privacyNotice}
              </a>
            </label>
          </sC.CheckboxWrapper>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={handleCreate}
            >
              {strings.createAccount}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p className="centered">
          {strings.alreadyHaveAccount + " "}
          <a className="bold underlined-link" href="/log_in">
            {strings.login}
          </a>
        </p>
      </Footer>
    </PreferencesPage>
  );
}
