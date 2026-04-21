import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { YellowMessageBox } from "../components/TopMessage.sc";
import strings from "../i18n/definitions";
import { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  CenteredColumn,
  SummaryTextWrapper,
  WordList,
  ExercisesFrom,
  CongratulationsContainer,
  GoodJobTitle,
  ProgressionButtonsRow,
} from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import { timeToHumanReadable, formatFutureDueTime } from "../utils/misc/readableTime";
import Pluralize from "../utils/text/pluralize";
import { StyledButton } from "../components/allButtons.sc";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import { ExercisesCounterContext } from "./ExercisesCounterContext";
import ExerciseProgressSummary from "./ExercisesProgressSummary";
import { WEB_READER } from "../reader/ArticleReader";
import useAnonymousUpgrade from "../hooks/useAnonymousUpgrade";

export default function Congratulations({
  // Props from router
  backButtonAction,
  keepExercisingAction,
  toScheduledExercises,
}) {
  const location = useLocation();
  const history = useHistory();

  // Get session data from route state
  const sessionData = location.state || {};
  const {
    articleID,
    isOutOfWordsToday: isOutOfWordsTodayFromState,
    totalPracticedBookmarksInSession = 0,
    correctBookmarks = [],
    incorrectBookmarks = [],
    exerciseSessionTimer = 0,
    articleURL,
    articleTitle,
    source = WEB_READER,
  } = sessionData;

  // Redirect to exercises if no session data (user navigated directly)
  useEffect(() => {
    if (!location.state) {
      history.replace("/exercises");
    }
  }, [location.state, history]);

  // Use state for isOutOfWordsToday to allow updates
  const [isOutOfWordsToday, setIsOutOfWordsToday] = useState(isOutOfWordsTodayFromState);
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const { updateExercisesCounter } = useContext(ExercisesCounterContext);
  const [checkpointTime] = useState(exerciseSessionTimer);
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(removeArrayDuplicates(correctBookmarks));
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(incorrectBookmarks),
  );
  const [totalBookmarksReviewed, setTotalBookmarksReviewed] = useState();
  const [username, setUsername] = useState();
  const [nextWordDueText, setNextWordDueText] = useState(null);

  const { isAnonymous, checkUpgradeTrigger } = useAnonymousUpgrade();

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id));
    setIncorrectBookmarksToDisplay(incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id));
  }

  useEffect(() => {
    setUsername(userDetails.name);
    setTotalBookmarksReviewed(incorrectBookmarksToDisplay.length + correctBookmarksToDisplay.length);
    api.logUserActivity(api.COMPLETED_EXERCISES, articleID, "", source);
    updateExercisesCounter();

    // Fetch next word due time for the message
    api.getNextWordDueTime((nextTime) => {
      if (nextTime && new Date(nextTime) > new Date()) {
        setNextWordDueText(formatFutureDueTime(new Date(nextTime)));
      }
    });

    // Prompt anonymous users to create account after exercises
    if (isAnonymous) {
      checkUpgradeTrigger("exercises");
    }
    // eslint-disable-next-line
  }, []);
  
  // Show loading while redirecting or waiting for data
  if (!location.state || username === undefined || isOutOfWordsToday === undefined) {
    return <LoadingAnimation />;
  }

  function progressionButtonRender() {
    const isKeepExercisingDisabled = incorrectBookmarksToDisplay.length === 0 && correctBookmarksToDisplay.length === 0;

    if (articleID)
      return (
        <>
          <StyledButton $navigation onClick={keepExercisingAction} $disabled={isKeepExercisingDisabled} disabled={isKeepExercisingDisabled}>
            {strings.keepExercising}
          </StyledButton>
        </>
      );
    else if (!isOutOfWordsToday)
      return (
        <>
          <StyledButton $navigation onClick={keepExercisingAction} $disabled={isKeepExercisingDisabled} disabled={isKeepExercisingDisabled}>
            {strings.keepExercising}
          </StyledButton>
        </>
      );
  }

  return (
    <>
      <CongratulationsContainer>
        <CenteredColumn className="centeredColumn">
          {articleID && (
            <ExercisesFrom>
              From: <a href={articleURL}>{articleTitle}</a>
            </ExercisesFrom>
          )}
          <GoodJobTitle>
            {strings.goodJob}{isAnonymous ? "" : ` ${username}`}!
          </GoodJobTitle>
          </CenteredColumn> 

        <SummaryTextWrapper>
          <p>
            You have done <b>{totalPracticedBookmarksInSession}</b>{" "}
            
            {Pluralize.exercise(totalPracticedBookmarksInSession)} in <b>{timeToHumanReadable(checkpointTime)}</b>.
          </p>
        </SummaryTextWrapper>

        <ExerciseProgressSummary /> 
          {incorrectBookmarksToDisplay.length > 0 && (
            <WordList>
              <b>{strings.wordsIncorrect}</b>
              {incorrectBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
              <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} isOnCongratulationsPage={true} />
              </s.ContentOnRow>
              ))}
            </WordList>
          )}
        
        {correctBookmarksToDisplay.length > 0 && (
          <WordList>
            <b>{strings.wordsCorrect}</b>
            {correctBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} isOnCongratulationsPage={true} />
              </s.ContentOnRow>
            ))}
          </WordList>
        )}
        <>
          <ProgressionButtonsRow>
            {progressionButtonRender()}
          </ProgressionButtonsRow>
        </>
      </CongratulationsContainer>
    </>
  );
}
