import { useState, useEffect } from "react";

import LocalStorage from "../../assorted/LocalStorage";

import { scrollToTop } from "../../utils/misc/scrollToTop";

import redirect from "../../utils/routing/routing";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import { Heading } from "../_pages_shared/Heading.sc";
import { Main } from "../_pages_shared/Main.sc";
import { Form } from "../_pages_shared/Form.sc";
import { FullWidthErrorMsg } from "../../components/FullWidthErrorMsg.sc";
import { FormSection } from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import { ButtonContainer } from "../_pages_shared/ButtonContainer.sc";
import { Button } from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";

import validator from "../../assorted/validator";
import strings from "../../i18n/definitions";
import LoadingAnimation from "../../components/LoadingAnimation";

import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import { setTitle } from "../../assorted/setTitle";

export default function LanguagePreferences({ api }) {
  const [learned_language_on_register, handleLearned_language_on_register] =
    useFormField("");
  const [native_language_on_register, handleNative_language_on_register] =
    useFormField("en");
  const [learned_cefr_level_on_register, handleLearned_cefr_level_on_register] =
    useFormField("");
  const [systemLanguages, setSystemLanguages] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      scrollToTop();
    }
  }, [errorMessage]);

  useEffect(() => {
    setTitle(strings.languagePreferences);

    api.getSystemLanguages((languages) => {
      languages.learnable_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      languages.native_languages.sort((a, b) => (a.name > b.name ? 1 : -1));
      setSystemLanguages(languages);
    });
    // eslint-disable-next-line
  }, []);

  //The useEffect hooks below take care of updating initial language preferences
  //in real time
  useEffect(() => {
    LocalStorage.setLearnedLanguage_OnRegister(learned_language_on_register);
  }, [learned_language_on_register]);

  useEffect(() => {
    LocalStorage.setLearnedCefrLevel_OnRegister(learned_cefr_level_on_register);
  }, [learned_cefr_level_on_register]);

  useEffect(() => {
    LocalStorage.setNativeLanguage_OnRegister(native_language_on_register);
  }, [native_language_on_register]);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  let validatorRules = [
    [
      learned_language_on_register === "",
      "Please select language you want to practice",
    ],
    [
      learned_cefr_level_on_register === "",
      "Please select your current level in language you want to practice",
    ],
    [
      native_language_on_register === "",
      "Please select language you want to translations in",
    ],
  ];

  function validateAndRedirect(e) {
    e.preventDefault();
    if (!validator(validatorRules, setErrorMessage)) {
      return;
    }
    redirect("/create_account");
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>
          What language would&nbsp;you&nbsp;like&nbsp;to&nbsp;learn?
        </Heading>
      </Header>
      <Main>
        <p>
          After this step, you will need an{" "}
          <span className="bold">invite code</span> to continue registration. If
          you don't have one yet, reach out to us at{" "}
          <span className="bold">{strings.zeeguuTeamEmail}</span>.
        </p>
        <Form action={""}>
          {errorMessage && (
            <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
          )}
          <FormSection>
            <Selector
              selectedValue={learned_language_on_register}
              label={strings.learnedLanguage}
              placeholder={strings.learnedLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"practiced-languages"}
              options={systemLanguages.learnable_languages}
              onChange={handleLearned_language_on_register}
            />

            <Selector
              selectedValue={learned_cefr_level_on_register}
              label={strings.levelOfLearnedLanguage}
              placeholder={strings.levelOfLearnedLanguagePlaceholder}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              id={"level-of-practiced-languages"}
              options={CEFR_LEVELS}
              onChange={handleLearned_cefr_level_on_register}
            />

            <Selector
              selectedValue={native_language_on_register}
              label={strings.baseLanguage}
              placeholder={strings.baseLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"translation-languages"}
              options={systemLanguages.native_languages}
              onChange={handleNative_language_on_register}
            />
          </FormSection>
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={validateAndRedirect}
            >
              {strings.next} <RoundedForwardArrow />
            </Button>
          </ButtonContainer>
          <p className="centered">
            {strings.alreadyHaveAccount + " "}
            <a className="bold underlined-link" href="/log_in">
              {strings.login}
            </a>
          </p>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
