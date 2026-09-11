import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { APIContext } from "../../contexts/APIContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

import { setTitle } from "../../assorted/setTitle";

import { scrollToTop } from "../../utils/misc/scrollToTop";
import LocalStorage from "../../assorted/LocalStorage";
import useLanguageChoiceFields from "../../hooks/useLanguageChoiceFields";
import { saveLearnedVarietyAfterSignup } from "../../utils/misc/saveLearnedVariety";
import LanguageChoiceFields from "../../components/LanguageChoiceFields";
import strings from "../../i18n/definitions";
import { saveSharedUserInfo, setUserSession } from "../../utils/cookies/userInfo";

import CardPage from "../_pages_shared/CardPage";
import Header from "../_pages_shared/Header";
import PageTitle from "../_pages_shared/PageTitle.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
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

  const languageChoice = useLanguageChoiceFields({ learnedLanguage: getInitialLearnedLanguage() });
  const { learnedLanguage, cefrLevel, variety, dialect, translationLanguage } = languageChoice;

  useEffect(() => {
    setTitle(strings.languagePreferences);
  }, []);

  // The account does not exist yet, so the answers are parked in LocalStorage as
  // they are given: on web this page hands off to /account_details, which reads
  // them back out.
  useEffect(() => {
    LocalStorage.setLearnedLanguage(learnedLanguage);
  }, [learnedLanguage]);

  useEffect(() => {
    LocalStorage.setLearnedCefrLevel(cefrLevel);
  }, [cefrLevel]);

  useEffect(() => {
    LocalStorage.setNativeLanguage(translationLanguage);
  }, [translationLanguage]);

  useEffect(() => {
    LocalStorage.setLearnedVariety(variety);
  }, [variety]);

  useEffect(() => {
    LocalStorage.setLearnedDialect(dialect);
  }, [dialect]);

  if (!sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  function validateAndRedirect(e) {
    e.preventDefault();
    if (!languageChoice.validate()) {
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
    const inviteCode = LocalStorage.getInviteCode();

    api.addAnonUser(
      uuid,
      password,
      inviteCode,
      {
        learned_language: learnedLanguage,
        native_language: translationLanguage,
        learned_cefr_level: cefrLevel,
      },
      (session) => {
        // Store credentials for future sessions
        LocalStorage.setAnonCredentials(uuid, password);

        // Set the session
        setUserSession(session);
        api.setSession(session);

        saveSharedUserInfo({ name: "Guest", native_language: translationLanguage }, session);

        // The account exists now, so the variety finally has somewhere to go --
        // and the redirect has to wait for it. This is a full-document
        // navigation, which cancels a fetch still in flight, and a round trip
        // here is routinely slower than the delay below.
        saveLearnedVarietyAfterSignup(api, () => {
          setIsCreatingAccount(false);

          // Small delay to ensure storage is written before redirect
          setTimeout(() => {
            window.location.href = "/select_interests";
          }, 100);
        });
      },
      (error) => {
        console.error("Failed to create anonymous account:", error);
        setIsCreatingAccount(false);
        // Fall back to regular account creation
        history.push("/account_details");
      },
    );
  }

  return (
    <CardPage pageWidth={"narrow"} isBackgroundFixed={true}>
      <Header>
        <PageTitle>What language would&nbsp;you&nbsp;like&nbsp;to&nbsp;learn?</PageTitle>
      </Header>
      <Main>
        <Form action={""}>
          <LanguageChoiceFields fields={languageChoice} />
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={validateAndRedirect}
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? "Setting up..." : strings.next} {!isCreatingAccount && <RoundedForwardArrow />}
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
    </CardPage>
  );
}
