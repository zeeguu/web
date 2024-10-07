import { useState, useEffect } from "react";

import LocalStorage from "../../assorted/LocalStorage";

import redirect from "../../utils/routing/routing";
import useFormField from "../../hooks/useFormField";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading";
import Main from "../_pages_shared/Main";
import Form from "../_pages_shared/Form";
import FormSection from "../_pages_shared/FormSection";
import Selector from "../../components/Selector";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";

import validator from "../../assorted/validator";
import { NotEmptyValidationWithMsg } from "../../utils/ValidateRule/ValidateRule";
import strings from "../../i18n/definitions";
import LoadingAnimation from "../../components/LoadingAnimation";

import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import { setTitle } from "../../assorted/setTitle";

export default function LanguagePreferences({ api }) {
  const [
    learnedLanguage,
    setLearnedLanguage,
    validateLearnedLanguage,
    isLearnedLanguageValid,
    learnedLanguageMsg,
  ] = useFormField("", NotEmptyValidationWithMsg("Please select a language."));
  const [
    nativeLanguage,
    setNativeLanguage,
    validateNativeLanguage,
    isNativeLanguageValid,
    nativeLanguageMsg,
  ] = useFormField(
    "en",
    NotEmptyValidationWithMsg("Please select a language."),
  );
  const [
    learnedCEFRLevel,
    setLearnedCEFRLevel,
    validateLearnedCEFRLevel,
    isLearnedCEFRLevelValid,
    learnedCEFRLevelMsg,
  ] = useFormField(
    "",
    NotEmptyValidationWithMsg(
      "Please select a level for your learned language.",
    ),
  );
  const [systemLanguages, setSystemLanguages] = useState();

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
    LocalStorage.setLearnedLanguage(learnedLanguage);
  }, [learnedLanguage]);

  useEffect(() => {
    LocalStorage.setLearnedCefrLevel(learnedCEFRLevel);
  }, [learnedCEFRLevel]);

  useEffect(() => {
    LocalStorage.setNativeLanguage(nativeLanguage);
  }, [nativeLanguage]);

  if (!systemLanguages) {
    return <LoadingAnimation />;
  }

  function validateAndRedirect(e) {
    e.preventDefault();
    if (
      validator([
        validateLearnedLanguage,
        validateLearnedCEFRLevel,
        validateNativeLanguage,
      ])
    )
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
          <FormSection>
            <Selector
              selectedValue={learnedLanguage}
              label={strings.learnedLanguage}
              placeholder={strings.learnedLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"practiced-languages"}
              options={systemLanguages.learnable_languages}
              isError={!isLearnedLanguageValid}
              errorMessage={learnedLanguageMsg}
              onChange={(e) => {
                setLearnedLanguage(e.target.value);
              }}
            />

            <Selector
              selectedValue={learnedCEFRLevel}
              label={strings.levelOfLearnedLanguage}
              placeholder={strings.levelOfLearnedLanguagePlaceholder}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              id={"level-of-practiced-languages"}
              options={CEFR_LEVELS}
              isError={!isLearnedCEFRLevelValid}
              errorMessage={learnedCEFRLevelMsg}
              onChange={(e) => {
                setLearnedCEFRLevel(e.target.value);
              }}
            />

            <Selector
              selectedValue={nativeLanguage}
              label={strings.baseLanguage}
              placeholder={strings.baseLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"translation-languages"}
              isError={!isNativeLanguageValid}
              errorMessage={nativeLanguageMsg}
              options={systemLanguages.native_languages}
              onChange={(e) => {
                setNativeLanguage(e.target.value);
              }}
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
