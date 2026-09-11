import { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { APIContext } from "../../contexts/APIContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from "react-router-dom";

import { setTitle } from "../../assorted/setTitle";

import { scrollToTop } from "../../utils/misc/scrollToTop";
import LocalStorage from "../../assorted/LocalStorage";
import useLanguageChoiceFields from "../../hooks/useLanguageChoiceFields";
import useAnonymousSignup, { isAnonModeEnabled } from "../../hooks/useAnonymousSignup";
import LanguageChoiceFields from "../../components/LanguageChoiceFields";
import { useDialectQuestion } from "../../components/LanguageDialectFields";
import strings from "../../i18n/definitions";

import CardPage from "../_pages_shared/CardPage";
import Header from "../_pages_shared/Header";
import PageTitle from "../_pages_shared/PageTitle.sc";
import Main from "../_pages_shared/Main.sc";
import Form from "../_pages_shared/Form.sc";
import ButtonContainer from "../_pages_shared/ButtonContainer.sc";
import Button from "../_pages_shared/Button.sc";
import RoundedForwardArrow from "@mui/icons-material/ArrowForwardRounded";
import LoadingAnimation from "../../components/LoadingAnimation";

export default function LanguagePreferences() {
  const history = useHistory();
  const location = useLocation();
  const api = useContext(APIContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);
  const { isCreatingAccount, createAnonymousAccountAndContinue } = useAnonymousSignup(api, () =>
    history.push("/account_details"),
  );

  function getQueryParam(name) {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function getInitialLearnedLanguage() {
    const selectedLanguage = getQueryParam("selected_language");
    return selectedLanguage || "";
  }

  const languageChoice = useLanguageChoiceFields({ learnedLanguage: getInitialLearnedLanguage() });
  const { learnedLanguage, cefrLevel, translationLanguage } = languageChoice;

  // Whether there is a step after this one at all.
  const { hasDialectQuestion } = useDialectQuestion(learnedLanguage);

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



  if (!sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  function validateAndRedirect(e) {
    e.preventDefault();
    if (!languageChoice.validate()) {
      scrollToTop();
      return;
    }

    // A language with more than one voice gets one more step; the rest go
    // straight on, so most learners never see it.
    if (hasDialectQuestion) {
      history.push("/language_variety_preferences");
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
