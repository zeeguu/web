import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { APIContext } from "../../contexts/APIContext";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { setTitle } from "../../assorted/setTitle";
import LocalStorage from "../../assorted/LocalStorage";
import useAnonymousSignup, { isAnonModeEnabled } from "../../hooks/useAnonymousSignup";
import LanguageCountryFields, { useCountryQuestions } from "../../components/LanguageCountryFields";
import FormSection from "../_pages_shared/FormSection.sc";
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

/**
 * The two country questions, on a step of their own.
 *
 * They were briefly asked on the previous step, under the language, the level
 * and the translation language. Five questions did not fit a phone: the card
 * scrolled and the button that leaves it fell below the fold. So that step keeps
 * the three questions every learner answers, and these two -- which most never
 * see -- moved here.
 *
 * Only a handful of languages divide along national lines. The step before skips
 * straight past when there is nothing to ask, and arriving here directly in that
 * case redirects rather than showing an empty card.
 */
export default function LanguageVarietyPreferences() {
  const history = useHistory();
  const api = useContext(APIContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  // Parked by the step before, which is also where they are read back from if a
  // learner comes back to this one.
  const learnedLanguage = LocalStorage.getLearnedLanguage();
  const [variety, setVariety] = useState(LocalStorage.getLearnedVariety());
  const [dialect, setDialect] = useState(LocalStorage.getLearnedDialect());

  const { hasCountryQuestions } = useCountryQuestions(learnedLanguage);
  const { isCreatingAccount, createAnonymousAccountAndContinue } = useAnonymousSignup(api, () =>
    history.push("/account_details"),
  );

  useEffect(() => {
    setTitle(strings.languageVarietyPreferences);
  }, []);

  useEffect(() => {
    LocalStorage.setLearnedVariety(variety);
  }, [variety]);

  useEffect(() => {
    LocalStorage.setLearnedDialect(dialect);
  }, [dialect]);

  // Nothing to ask: reached by a back button, a bookmark, or a language that has
  // no varieties. Move on rather than show a card with one sentence and a button.
  useEffect(() => {
    if (sortedSystemLanguages && !hasCountryQuestions) continueToAccount();
    // eslint-disable-next-line
  }, [sortedSystemLanguages, hasCountryQuestions]);

  function continueToAccount() {
    if (isAnonModeEnabled()) {
      createAnonymousAccountAndContinue();
    } else {
      history.push("/account_details");
    }
  }

  if (!sortedSystemLanguages) {
    return <LoadingAnimation />;
  }

  return (
    <CardPage pageWidth={"narrow"} isBackgroundFixed={true}>
      <Header>
        <PageTitle>{strings.languageVarietyPreferences}</PageTitle>
      </Header>
      <Main>
        <Form action={""}>
          <FormSection>
            <LanguageCountryFields
              fields={{ learnedLanguage, variety, setVariety, dialect, setDialect }}
            />
          </FormSection>
          <p className="centered">{strings.youCanChangeLater}</p>
          <ButtonContainer className={"padding-medium"}>
            <Button
              type={"submit"}
              className={"full-width-btn"}
              onClick={(e) => {
                e.preventDefault();
                continueToAccount();
              }}
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? "Setting up..." : strings.next}{" "}
              {!isCreatingAccount && <RoundedForwardArrow />}
            </Button>
          </ButtonContainer>
        </Form>
      </Main>
    </CardPage>
  );
}
