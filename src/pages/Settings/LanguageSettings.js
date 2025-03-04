import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import { saveUserInfoIntoCookies } from "../../utils/cookies/userInfo";
import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import strings from "../../i18n/definitions";
import LocalStorage from "../../assorted/LocalStorage";
import LoadingAnimation from "../../components/LoadingAnimation";
import LanguageSelector from "../../components/LanguageSelector";
import Button from "../_pages_shared/Button.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Form from "../_pages_shared/Form.sc";
import FormSection from "../_pages_shared/FormSection.sc";
import PreferencesPage from "../_pages_shared/PreferencesPage";
import Header from "../_pages_shared/Header";
import Heading from "../_pages_shared/Heading.sc";
import Main from "../_pages_shared/Main.sc";
import FullWidthErrorMsg from "../../components/FullWidthErrorMsg.sc";
import BackArrow from "./settings_pages_shared/BackArrow";
import Selector from "../../components/Selector";
import { setTitle } from "../../assorted/setTitle";
import useFormField from "../../hooks/useFormField";
import {
  NonEmptyValidator,
  Validator,
} from "../../utils/ValidatorRule/Validator";
import useShadowRef from "../../hooks/useShadowRef";
import { scrollToTop } from "../../utils/misc/scrollToTop";
import validateRules from "../../assorted/validateRules";
import { APIContext } from "../../contexts/APIContext";

export default function LanguageSettings() {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails, session } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempUserDetails, setTempUserDetails] = useState(null);
  const [languages, setLanguages] = useState();
  const [
    learnedLanguage,
    setLearnedLanguage,
    validateLearnedLanguage,
    isLearnedLanguageValid,
    learnedLanguageErrorMsg,
  ] = useFormField("", NonEmptyValidator("Please select a language."));

  const learnedLanguageRef = useShadowRef(learnedLanguage);
  const [
    nativeLanguage,
    setNativeLanguage,
    validateNativeLanguage,
    isNativeLanguageValid,
    nativeLanguageMsg,
  ] = useFormField("en", [
    NonEmptyValidator("Please select a language."),
    new Validator((v) => {
      return v !== learnedLanguageRef.current;
    }, "Your Translation language needs to be different than your learned language."),
  ]);
  const history = useHistory();

  function setCEFRlevel(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setTempUserDetails({
      ...data,
      cefr_level: levelNumber,
    });
  }

  useEffect(() => {
    setTitle(strings.languageSettings);
  }, []);

  useEffect(() => {
    api.getUserDetails((data) => {
      setTempUserDetails(data);
      setCEFRlevel(data);
      setLearnedLanguage(data.learned_language);
      setNativeLanguage(data.native_language);
    });

    api.getSystemLanguages((systemLanguages) => {
      setLanguages(systemLanguages);
    });
    // eslint-disable-next-line
  }, [session, api]);

  function updateUserInfo(info) {
    LocalStorage.setUserInfo(info);

    const newUserDetails = {
      ...userDetails,
      learned_language: info.learned_language,
      native_language: info.native_language,
    };
    setUserDetails(newUserDetails);
    saveUserInfoIntoCookies(info);
  }

  function updateNativeLanguage(lang_code) {
    setNativeLanguage(lang_code);
    setTempUserDetails({
      ...tempUserDetails,
      native_language: lang_code,
    });
  }

  function updateCEFRLevel(level) {
    setTempUserDetails({
      ...tempUserDetails,
      cefr_level: level,
    });
  }

  function updateLearnedLanguage(lang_code) {
    console.log("language code in updateLearnedLanguage");
    setLearnedLanguage(lang_code);
    console.log(lang_code);
    setTempUserDetails({
      ...tempUserDetails,
      learned_language: lang_code,
    });
  }

  function handleSave(e) {
    e.preventDefault();
    if (!validateRules([validateLearnedLanguage, validateNativeLanguage]))
      scrollToTop();
    else
      api.saveUserDetails(tempUserDetails, setErrorMessage, () => {
        updateUserInfo(tempUserDetails);
        history.goBack();
      });
  }

  if (!tempUserDetails || !languages) {
    return <LoadingAnimation />;
  }

  return (
    <PreferencesPage layoutVariant={"minimalistic-top-aligned"}>
      <BackArrow />
      <Header withoutLogo>
        <Heading>{strings.languageSettings}</Heading>
      </Header>
      <Main>
        <Form>
          <FormSection>
            {errorMessage && (
              <FullWidthErrorMsg>{errorMessage}</FullWidthErrorMsg>
            )}
            <LanguageSelector
              id={"practiced-language-selector"}
              label={strings.learnedLanguage}
              languages={languages.learnable_languages}
              selected={learnedLanguage}
              onChange={(e) => {
                updateLearnedLanguage(e.target.value);
              }}
              isError={!isLearnedLanguageValid}
              errorMessage={learnedLanguageErrorMsg}
            />

            <Selector
              id={"cefr-levels-selector"}
              options={CEFR_LEVELS}
              optionLabel={(e) => e.label}
              optionValue={(e) => e.value}
              onChange={(e) => {
                updateCEFRLevel(e.target.value);
              }}
              selectedValue={tempUserDetails.cefr_level}
            />
          </FormSection>

          <FormSection>
            <LanguageSelector
              id={"translation-language-selector"}
              label={strings.baseLanguage}
              languages={languages.native_languages}
              selected={nativeLanguage}
              isError={!isNativeLanguageValid}
              errorMessage={nativeLanguageMsg}
              onChange={(e) => {
                updateNativeLanguage(e.target.value);
              }}
            />
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
