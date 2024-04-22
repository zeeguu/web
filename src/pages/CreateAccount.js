import { useState, useEffect } from "react";
import Select from "../components/Select";

import redirect from "../utils/routing/routing";

import InfoPage from "./info_page_shared/InfoPage";
import Header from "./info_page_shared/Header";
import Heading from "./info_page_shared/Heading";
import Main from "./info_page_shared/Main";
import Form from "./info_page_shared/Form";
import FormSection from "./info_page_shared/FormSection";
import InputField from "./info_page_shared/InputField";
import SelectOptions from "./info_page_shared/SelectOptions";
import Footer from "./info_page_shared/Footer";
import ButtonContainer from "./info_page_shared/ButtonContainer";
import Button from "./info_page_shared/Button";

import validator from "../assorted/validator";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

import * as s from "../components/FormPage.sc";
import PrivacyNotice from "./PrivacyNotice";
import * as EmailValidator from "email-validator";

export default function CreateAccount({ api, handleSuccessfulSignIn }) {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [systemLanguages, setSystemLanguages] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
      // inviteCodeInputDOM.current.focus();
    });
    // eslint-disable-next-line
  }, []);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [name === "", strings.nameIsRequired],
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
    [password.length < 4, strings.passwordMustBeMsg],
  ];

  function handleCreate(e) {
    e.preventDefault();

    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }

    let userInfo = {
      name: name,
      email: email,
    };

    api.addBasicUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        api.getUserDetails((user) => {
          handleSuccessfulSignIn(user);
          redirect("/language_preferences");
        });
      },
      (error) => {
        setErrorMessage(error);
      },
    );
  }

  return (
    <InfoPage type={"narrow"}>
      <Header>
        <Heading>Create Beta Account</Heading>
      </Header>
      <Main>
        <p>
          {strings.thankYouMsgPrefix}
          <a
            href="mailto:zeeguu.team@gmail.com?subject=Invitation Code Request&body=Dear Zeeguu Team,
              %0D%0A%0D%0AI would like to request the Invitation Code to register for Zeeguu.%0D%0A%0D%0AThank you!"
          >
            <b> zeeguu.team@gmail.com</b>
          </a>
          {strings.thankYouMsgSuffix}
        </p>

        <Form action={""} method={"POST"}>
          <FormSection>
            <InputField
              type={"text"}
              label={"Invite code"}
              id={"invite-code"}
              name={"invite-code"}
              placeholder={strings.code}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <InputField
              type={"text"}
              label={"Full name"}
              id={"name"}
              name={"name"}
              placeholder={"First and last name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputField
              type={"email"}
              label={"Email"}
              id={"email"}
              name={"email"}
              placeholder={"example@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              type={"password"}
              label={"Password"}
              id={"password"}
              name={"password"}
              placeholder={"At least 4 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormSection>

          {/* <div className="inputField">
            <label>{strings.learnedLanguage}</label>

            <Select
              elements={systemLanguages.learnable_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setLearned_language}
            />
          </div>

          <div className="inputField">
            <label>{strings.levelOfLearnedLanguage}</label>

            <Select
              elements={CEFR_LEVELS}
              label={(e) => e.label}
              val={(e) => e.value}
              updateFunction={setLearned_cefr_level}
            />
          </div>

          <div className="inputField">
            <label>{strings.baseLanguage}</label>

            <Select
              elements={systemLanguages.native_languages}
              label={(e) => e.name}
              val={(e) => e.code}
              updateFunction={setNative_language}
              current={"en"}
            />
          </div> */}

          {/* <PrivacyNotice /> */}

          {errorMessage && <div className="error">{errorMessage}</div>}

          <ButtonContainer>
            <Button onClick={handleCreate}>{strings.createAccount}</Button>
          </ButtonContainer>
        </Form>
      </Main>
      <Footer>
        <p>
          Already have an account?{" "}
          <a className="links" href="/login">
            <b>Log in</b>
          </a>
        </p>
      </Footer>
    </InfoPage>
  );
}
