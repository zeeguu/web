import { useEffect, useContext } from "react";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom";

import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import { setTitle } from "../../assorted/setTitle";

import { scrollToTop } from "../../utils/misc/scrollToTop";
import { Validator } from "../../utils/ValidatorRule/Validator";
import useShadowRef from "../../hooks/useShadowRef";
import LocalStorage from "../../assorted/LocalStorage";
import useFormField from "../../hooks/useFormField";
import validateRules from "../../assorted/validateRules";
import { NonEmptyValidator } from "../../utils/ValidatorRule/Validator";
import strings from "../../i18n/definitions";

import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import Selector from "../../components/Selector";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import LoadingAnimation from "../../components/LoadingAnimation";

export default function LanguagePreferences() {
  const history = useHistory();
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);
  function getInitialLearnedLanguage() {
    const storedLearnedLanguage = LocalStorage.getLearnedLanguage();
    return storedLearnedLanguage || "";
  }
  const [
    learnedLanguage,
    setLearnedLanguage,
    validateLearnedLanguage,
    isLearnedLanguageValid,
    learnedLanguageMsg,
  ] = useFormField(
    getInitialLearnedLanguage(),
    NonEmptyValidator("Please select a language."),
  );

  const learnedLanguageRef = useShadowRef(learnedLanguage);
  const [
    translationLanguage,
    setTranslationLanguage,
    validateTranslationLanguage,
    isTranslationLanguageValid,
    translationLanguageErrorMsg,
  ] = useFormField("en", [
    NonEmptyValidator("Please select a language."),
    new Validator((translationLanguage) => {
      return translationLanguage !== learnedLanguageRef.current;
    }, "Your Translation language needs to be different than your learned language."),
  ]);
  const [
    learnedCEFRLevel,
    setLearnedCEFRLevel,
    validateLearnedCEFRLevel,
    isLearnedCEFRLevelValid,
    learnedCEFRLevelMsg,
  ] = useFormField(
    "",
    NonEmptyValidator("Please select a level for your learned language."),
  );

  useEffect(() => {
    setTitle(strings.languagePreferences);
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
    LocalStorage.setNativeLanguage(translationLanguage);
  }, [translationLanguage]);

  if (!sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  function validateAndRedirect(e) {
    e.preventDefault();
    if (
      !validateRules([
        validateLearnedLanguage,
        validateLearnedCEFRLevel,
        validateTranslationLanguage,
      ])
    )
      scrollToTop();
    else history.push("/account_details");
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
              options={sortedSystemLanguages.learnable_languages}
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
              selectedValue={translationLanguage}
              label={strings.baseLanguage}
              placeholder={strings.baseLanguagePlaceholder}
              optionLabel={(e) => e.name}
              optionValue={(e) => e.code}
              id={"translation-languages"}
              isError={!isTranslationLanguageValid}
              errorMessage={translationLanguageErrorMsg}
              options={sortedSystemLanguages.native_languages}
              onChange={(e) => {
                setTranslationLanguage(e.target.value);
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
            <Link className="bold underlined-link" to="/log_in">
              {strings.login}
            </Link>
          </p>
        </Form>
      </Main>
    </PreferencesPage>
  );
}
