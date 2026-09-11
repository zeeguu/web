import { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import { APIContext } from "../../contexts/APIContext";
import { SystemLanguagesContext } from "../../contexts/SystemLanguagesContext";
import { setTitle } from "../../assorted/setTitle";
import LocalStorage from "../../assorted/LocalStorage";
import useAnonymousSignup, { isAnonModeEnabled } from "../../hooks/useAnonymousSignup";
import LanguageDialectFields, { useDialectQuestion } from "../../components/LanguageDialectFields";
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
 * Which variety the audio lessons are spoken in, on a step of its own.
 *
 * It was briefly asked on the previous step, under the language, its variety,
 * the level and the translation language. A fifth question did not fit a phone:
 * the card scrolled and the button that leaves it fell below the fold, so the
 * step before was left exactly as it was and this one was added after it.
 *
 * Most learners never see it -- only languages whose varieties have voices ask
 * it at all. The step before skips straight past when there is nothing to ask,
 * and arriving here directly in that case redirects rather than showing an empty
 * card.
 */
export default function LanguageVarietyPreferences() {
  const history = useHistory();
  const api = useContext(APIContext);
  const { sortedSystemLanguages } = useContext(SystemLanguagesContext);

  // Parked by the step before, which is also where they are read back from if a
  // learner comes back to this one.
  const learnedLanguage = LocalStorage.getLearnedLanguage();
  const [dialect, setDialect] = useState(LocalStorage.getLearnedDialect());

  const { hasDialectQuestion } = useDialectQuestion(learnedLanguage);
  const { isCreatingAccount, createAnonymousAccountAndContinue } = useAnonymousSignup(api, () =>
    history.push("/account_details"),
  );

  useEffect(() => {
    setTitle(strings.languageVarietyPreferences);
  }, []);

  useEffect(() => {
    LocalStorage.setLearnedDialect(dialect);
  }, [dialect]);

  // Nothing to ask: reached by a back button, a bookmark, or a language that has
  // no varieties. Move on rather than show a card with one sentence and a button.
  useEffect(() => {
    if (sortedSystemLanguages && !hasDialectQuestion) continueToAccount();
    // eslint-disable-next-line
  }, [sortedSystemLanguages, hasDialectQuestion]);

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
          <LanguageDialectFields fields={{ learnedLanguage, dialect, setDialect }} />
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
