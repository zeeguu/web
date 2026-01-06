import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import { YellowMessageBox } from "../components/TopMessage.sc";
import strings from "../i18n/definitions";
import { useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { CenteredColumn } from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import { timeToHumanReadable } from "../utils/misc/readableTime";
import CollapsablePanel from "../components/CollapsablePanel";
import Pluralize from "../utils/text/pluralize";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
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

  const { isMobile } = useScreenWidth();
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
          <StyledButton secondary onClick={keepExercisingAction} disabled={isKeepExercisingDisabled}>
            {strings.keepExercising}
          </StyledButton>
          <StyledButton primary onClick={toScheduledExercises}>
            {strings.goToExercises}
          </StyledButton>
        </>
      );
    else if (!isOutOfWordsToday)
      return (
        <StyledButton primary onClick={keepExercisingAction} disabled={isKeepExercisingDisabled}>
          {strings.keepExercising}
        </StyledButton>
      );
    else
      return (
        <StyledButton primary onClick={backButtonAction}>
          {strings.goToReading}
        </StyledButton>
      );
  }

  return (
    <>
      <s.NarrowColumn className="narrowColumn">
        {isMobile && <BackArrow func={backButtonAction} />}
        <CenteredColumn className="centeredColumn">
          <h1>
            {strings.goodJob} {username}!
          </h1>
        </CenteredColumn>
         <CenteredColumn className="centeredColumn">
        <div style={{ marginLeft: "1em", display: "flex", flexDirection: "column", justifyContent:"center" }}>
          <p style={{ textAlign: "center" }}>
            You have just done <b>{totalPracticedBookmarksInSession}</b>{" "}
            
            {Pluralize.exercise(totalPracticedBookmarksInSession)} in <b>{timeToHumanReadable(checkpointTime)}</b>. Here are some highlights of your current progress you have made.
            {articleID && (
              <p>
                These words are now part of your vocabulary exercises, using spaced repetition and smart learning
                techniques to help you remember them better.
              </p>
            )}
          </p>
        </div>
        {articleID && (
          <p>
            You practiced words from: <a href={articleURL}>{articleTitle}</a>
          </p>
          
        )}
        </CenteredColumn>
        <ExerciseProgressSummary/>
        {incorrectBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={incorrectBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} isOnCongratulationsPage={true}  />
              </s.ContentOnRow>
            ))}
            topMessage={strings.wordsIncorrect}
            defaultOpen={true}
          ></CollapsablePanel>
        )}
        <br />
        {correctBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={correctBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} isOnCongratulationsPage={true} />
              </s.ContentOnRow>
            ))}
            topMessage={strings.wordsCorrect}
            defaultOpen={true}
          ></CollapsablePanel>
        )}

        <br />
        {isOutOfWordsToday && (
          <YellowMessageBox>
            <p>
              There are no more words for you to practice today. Come back tomorrow to see the words that you should
              practice again according to our spaced-repetition schedule.
            </p>
          </YellowMessageBox>
        )}
        {!isOutOfWordsToday && (
          <>
            <YellowMessageBox>
              <p>There are words that we recommend you still practice today. Do you want do to it now?</p>

              <CenteredColumn className="contentOnRow" style={{ marginTop: "-1em", justifyContent: "space-around" }}>
                {progressionButtonRender()}
              </CenteredColumn>
            </YellowMessageBox>
          </>
        )}
      </s.NarrowColumn>
    </>
  );
}
