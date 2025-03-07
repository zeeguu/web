import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { APIContext } from "../../contexts/APIContext";
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

export default function LanguageSettings() {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails, session } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [CEFR, setCEFR] = useState(null);
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
  const isPageMounted = useRef(true);

  function setCEFRlevelFromUserContext(data) {
    const levelKey = data.learned_language + "_cefr_level";
    const levelNumber = data[levelKey];
    setCEFR(levelNumber);
  }

  useEffect(() => {
    setTitle(strings.languageSettings);
  }, []);

  useEffect(() => {
    isPageMounted.current = true;

    if (isPageMounted.current) {
      setCEFRlevelFromUserContext(userDetails);
      setLearnedLanguage(userDetails.learned_language);
      setNativeLanguage(userDetails.native_language);
    }

    api.getSystemLanguages((systemLanguages) => {
      if (isPageMounted.current) {
        setLanguages(systemLanguages);
      }
    });

    return () => {
      isPageMounted.current = false;
    };
    // eslint-disable-next-line
  }, [session, api]);

  function handleSave(e) {
    e.preventDefault();
    if (!validateRules([validateLearnedLanguage, validateNativeLanguage]))
      scrollToTop();
    else {
      const newUserDetails = {
        ...userDetails,
        learned_language: learnedLanguage,
        native_language: nativeLanguage,
        [learnedLanguage + "_cefr_level"]: CEFR,
      };

      const newUserDetailsForAPI = {
        ...newUserDetails,
        cefr_level: CEFR,
      };

      api.saveUserDetails(newUserDetailsForAPI, setErrorMessage, () => {
        setUserDetails(newUserDetails);
        LocalStorage.setUserInfo(newUserDetails);
        saveUserInfoIntoCookies(newUserDetails);
        history.goBack();
      });
    }
  }

  if (!userDetails || !languages) {
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
                setLearnedLanguage(e.target.value);
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
                setCEFR(parseInt(e.target.value));
              }}
              selectedValue={CEFR}
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
                setNativeLanguage(e.target.value);
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
