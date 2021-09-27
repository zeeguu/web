import { useState, useRef, useEffect } from "react";
import Select from "../components/Select";

import { useHistory } from "react-router-dom";

import validator from "../assorted/validator";
import LoadingAnimation from "../components/LoadingAnimation";
import strings from "../i18n/definitions";

import { CEFR_LEVELS } from "../assorted/cefrLevels";

import * as s from "../components/FormPage.sc";
import PrivacyNotice from "./PrivacyNotice";
import * as EmailValidator from "email-validator";

export default function CreateAccount({ api, signInAndRedirect }) {
  const [inviteCode, setInviteCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [learned_language, setLearned_language] = useState("");
  const [native_language, setNative_language] = useState("");
  const [learned_cefr_level, setLearned_cefr_level] = useState("");

  const [systemLanguages, setSystemLanguages] = useState();

  const [errorMessage, setErrorMessage] = useState("");

  let history = useHistory();
  let inviteCodeInputDOM = useRef();

  useEffect(() => {
    api.getSystemLanguages((languages) => {
      setSystemLanguages(languages);
      inviteCodeInputDOM.current.focus();
    });
    // eslint-disable-next-line
  }, []);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [name === "", strings.nameIsRequired],
    [!EmailValidator.validate(email), strings.plsProvideValidEmail],
    [learned_language === "", strings.learnedLanguageIsRequired],
    [learned_cefr_level === "", strings.languagelevelIsRequired],
    [native_language === "", strings.plsSelectBaseLanguage],
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
      learned_language: learned_language,
      native_language: native_language,
      learned_cefr_level: learned_cefr_level,
    };

    api.addUser(
      inviteCode,
      password,
      userInfo,
      (session) => {
        // if the created user is a teacher, we only know
        // by asking the api; so we do that
        api.isTeacher((teacher_status) => {
          userInfo["is_teacher"] = teacher_status === "True";
          signInAndRedirect(userInfo, history);
        });
      },
      (error) => {
        setErrorMessage(error);
      }
    );
  }

  return (
    <s.PageBackground>
      <s.LogoOnTop />
      <s.FormContainer>
        <form action="">
          <s.FormTitle>{strings.createAccount}</s.FormTitle>

          <p>
            {strings.thankYouMsgPrefix}
            <b>zeeguu.team@gmail.com</b>
            {strings.thankYouMsgSuffix}
          </p>

          <div className="inputField">
            <label>{strings.inviteCode}</label>
            <input
              ref={inviteCodeInputDOM}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder={strings.code}
            />
          </div>

          <div className="inputField">
            <label>{strings.name}</label>
            <input
              placeholder={strings.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="inputField">
            <label>{strings.email}</label>
            <input
              placeholder={strings.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputField">
            <label>{strings.password}</label>
            <input
              type="password"
              placeholder={strings.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="inputField">
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
            />
          </div>

          <PrivacyNotice />

          {errorMessage && <div className="error">{errorMessage}</div>}

          <div className="inputField">
            <s.FormButton onClick={handleCreate}>
              {strings.createAccount}
            </s.FormButton>
          </div>
        </form>
      </s.FormContainer>
    </s.PageBackground>
  );
}
