import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { APIContext } from "../../contexts/APIContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { CEFR_LEVELS } from "../../assorted/cefrLevels";
import { setTitle } from "../../assorted/setTitle";

import { scrollToTop } from "../../utils/misc/scrollToTop";
import LocalStorage from "../../assorted/LocalStorage";
import useFormField from "../../hooks/useFormField";
import validateRules from "../../assorted/validateRules";
import { NonEmptyValidator } from "../../utils/ValidatorRule/Validator";
import strings from "../../i18n/definitions";
import { saveSharedUserInfo, setUserSession } from "../../utils/cookies/userInfo";

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

// Helper to detect if we're in a Capacitor native app
const isCapacitor = () => {
  const platform = Capacitor.getPlatform();
  return platform === "ios" || platform === "android";
};

// Check if anonymous mode is enabled (for testing on web)
// Use: /language_preferences?anon=1
const isAnonModeEnabled = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("anon") === "1" || isCapacitor();
};

// Generate a UUID v4
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function LanguagePreferences() {
  const history = useHistory();
  const location = useLocation();
  const api = useContext(APIContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  function getQueryParam(name) {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function getInitialLearnedLanguage() {
    const selectedLanguage = getQueryParam("selected_language");
    return selectedLanguage || "";
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

  // Hardcode translation language to English - users can change in settings if needed
  const translationLanguage = "en";
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
  }, []);

  if (!sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  function validateAndRedirect(e) {
    e.preventDefault();
    if (
      !validateRules([
        validateLearnedLanguage,
        validateLearnedCEFRLevel,
      ])
    ) {
      scrollToTop();
      return;
    }

    // On mobile (Capacitor) or if ?anon=1, create anonymous account and go to interests
    if (isAnonModeEnabled()) {
      createAnonymousAccountAndContinue();
    } else {
      // On web, go to account creation page
      history.push("/account_details");
    }
  }

  function createAnonymousAccountAndContinue() {
    setIsCreatingAccount(true);
    const uuid = generateUUID();
    const password = generateUUID();

    api.addAnonUser(
      uuid,
      password,
      {
        learned_language: learnedLanguage,
        native_language: translationLanguage,
        learned_cefr_level: learnedCEFRLevel,
      },
      (session) => {
        // Store credentials for future sessions
        LocalStorage.setAnonCredentials(uuid, password);

        // Set the session
        setUserSession(session);
        api.session = session;

        saveSharedUserInfo(
          { name: "Guest", native_language: translationLanguage },
          session
        );

        setIsCreatingAccount(false);

        // Small delay to ensure storage is written before redirect
        setTimeout(() => {
          window.location.href = "/select_interests";
        }, 100);
      },
      (error) => {
        console.error("Failed to create anonymous account:", error);
        setIsCreatingAccount(false);
        // Fall back to regular account creation
        history.push("/account_details");
      }
    );
  }

  return (
    <PreferencesPage pageWidth={"narrow"}>
      <Header>
        <Heading>
          What language would&nbsp;you&nbsp;like&nbsp;to&nbsp;learn?
        </Heading>
      </Header>
      <Main>
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
          </FormSection>
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={validateAndRedirect}
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? "Setting up..." : strings.next}{" "}
              {!isCreatingAccount && <RoundedForwardArrow />}
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
