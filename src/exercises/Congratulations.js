import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect, useContext } from "react";
import { CenteredColumn } from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import { timeToHumanReadable } from "../utils/misc/readableTime";
import CollapsablePanel from "../components/CollapsablePanel";
import Pluralize from "../utils/text/pluralize";
import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import { StyledButton } from "../components/allButtons.sc";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";

export default function Congratulations({
  articleID,
  isOutOfWordsToday,
  totalPracticedBookmarksInSession,
  articleTitle,
  articleURL,
  correctBookmarks,
  incorrectBookmarks,
  backButtonAction,
  keepExercisingAction,
  toScheduledExercises,
  source,
  exerciseSessionTimer,
}) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const [checkpointTime] = useState(exerciseSessionTimer);
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(removeArrayDuplicates(correctBookmarks));
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(incorrectBookmarks),
  );
  const [totalBookmarksReviewed, setTotalBookmarksReviewed] = useState();
  const [username, setUsername] = useState();

  const { screenWidth } = useScreenWidth();

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id));
    setIncorrectBookmarksToDisplay(incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id));
  }

  useEffect(() => {
    setUsername(userDetails.name);
    setTotalBookmarksReviewed(incorrectBookmarksToDisplay.length + correctBookmarksToDisplay.length);
    api.logUserActivity(api.COMPLETED_EXERCISES, articleID, "", source);
    // eslint-disable-next-line
  }, []);

  if (username === undefined || isOutOfWordsToday === undefined) {
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
        {screenWidth < MOBILE_WIDTH && <BackArrow />}

        <CenteredColumn className="centeredColumn">
          <h1>
            {strings.goodJob} {username}!
          </h1>
        </CenteredColumn>
        <div style={{ marginLeft: "0.5em" }}>
          <p>
            You have just done <b>{totalPracticedBookmarksInSession}</b> {Pluralize.exercise(totalBookmarksReviewed)} in{" "}
            <b>{timeToHumanReadable(checkpointTime)}</b>.
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

        {incorrectBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={incorrectBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} />
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
                <Word key={each.id} bookmark={each} notifyDelete={deleteBookmark} source={source} />
              </s.ContentOnRow>
            ))}
            topMessage={strings.wordsCorrect}
            defaultOpen={true}
          ></CollapsablePanel>
        )}

        <br />
        {isOutOfWordsToday && (
          <p>
            There are no more words for you to practice today. Come back tomorrow to see the words that you should
            practice again according to our spaced-repetition schedule.
          </p>
        )}

        <CenteredColumn className="contentOnRow" style={{ marginTop: "2em", justifyContent: "space-around" }}>
          {progressionButtonRender()}
        </CenteredColumn>
      </s.NarrowColumn>
    </>
  );
}
