import Word from "../words/Word";
import * as s from "../reader/ArticleReader.sc";
import strings from "../i18n/definitions";
import { useState, useEffect, useContext } from "react";
import { CenteredColumn } from "./Congratulations.sc";
import { removeArrayDuplicates } from "../utils/basic/arrays";
import { LoadingAnimation } from "../components/LoadingAnimation.sc";
import LocalStorage from "../assorted/LocalStorage";
import { timeToHumanReadable } from "../utils/misc/readableTime";
import { ExerciseCountContext } from "./ExerciseCountContext";
import CollapsablePanel from "../components/CollapsablePanel";
import { MAX_EXERCISE_IN_LEARNING_BOOKMARKS } from "./ExerciseConstants";
import Pluralize from "../utils/text/pluralize";

export default function Congratulations({
  articleID,
  isAbleToAddBookmarksToPipe,
  hasExceededTotalBookmarks,
  totalPracticedBookmarksInSession,
  totalBookmarksInPipeline,
  articleTitle,
  articleURL,
  correctBookmarks,
  incorrectBookmarks,
  api,
  backButtonAction,
  keepExercisingAction,
  startExercisingNewWords,
  source,
  exerciseSessionTimer,
}) {
  const [checkpointTime] = useState(exerciseSessionTimer);
  const exerciseNotification = useContext(ExerciseCountContext);
  const [correctBookmarksToDisplay, setCorrectBookmarksToDisplay] = useState(
    removeArrayDuplicates(correctBookmarks),
  );
  const [incorrectBookmarksToDisplay, setIncorrectBookmarksToDisplay] =
    useState(removeArrayDuplicates(incorrectBookmarks));
  const [totalBookmarksReviewed, setTotalBookmarksReviewed] = useState();
  const [username, setUsername] = useState();

  function deleteBookmark(bookmark) {
    setCorrectBookmarksToDisplay(
      correctBookmarksToDisplay.filter((e) => e.id !== bookmark.id),
    );
    setIncorrectBookmarksToDisplay(
      incorrectBookmarksToDisplay.filter((e) => e.id !== bookmark.id),
    );
  }

  useEffect(() => {
    let userInfo = LocalStorage.userInfo();
    let name = userInfo.name;
    setUsername(name);
    setTotalBookmarksReviewed(
      incorrectBookmarksToDisplay.length + correctBookmarksToDisplay.length,
    );
    api.logUserActivity(api.COMPLETED_EXERCISES, articleID, "", source);
  }, []);

  if (username === undefined) {
    return <LoadingAnimation />;
  }
  const hasScheduledExercises = exerciseNotification.exerciseCounter > 0;
  const isThereMoreExercises =
    hasScheduledExercises || isAbleToAddBookmarksToPipe;
  const canStartLearningNewWords =
    isAbleToAddBookmarksToPipe &&
    !articleID &&
    exerciseNotification.exerciseCounter <= 0;
  const isOverTotalBookmarkLimit =
    hasExceededTotalBookmarks && !hasScheduledExercises;

  function progressionButtonRender() {
    if (hasScheduledExercises)
      return (
        <s.OrangeButton className="orangeButton" onClick={keepExercisingAction}>
          {strings.keepExercising}
        </s.OrangeButton>
      );
    else if (canStartLearningNewWords && isOverTotalBookmarkLimit)
      return (
        <>
          <s.OrangeButton className="orangeButton" onClick={backButtonAction}>
            {strings.goToReading}
          </s.OrangeButton>
          <s.WhiteButton
            className="whiteButton slightlyLarger"
            onClick={startExercisingNewWords}
          >
            {strings.startLearningNewWords}
          </s.WhiteButton>
        </>
      );
    else if (canStartLearningNewWords && !isOverTotalBookmarkLimit)
      return (
        <>
          <s.OrangeButton
            className="orangeButton slightlyLarger"
            onClick={startExercisingNewWords}
          >
            {strings.startLearningNewWords}
          </s.OrangeButton>
          <s.WhiteButton className="whiteButton" onClick={backButtonAction}>
            {strings.goToReading}
          </s.WhiteButton>
        </>
      );
    else if (canStartLearningNewWords && isOverTotalBookmarkLimit)
      return (
        <>
          <s.OrangeButton className="whiteButton" onClick={backButtonAction}>
            {strings.goToReading}
          </s.OrangeButton>
          <s.WhiteButton
            className="whiteButton slightlyLarger"
            onClick={startExercisingNewWords}
          >
            {strings.startLearningNewWords}
          </s.WhiteButton>
        </>
      );
    else
      return (
        <s.OrangeButton className="orangeButton" onClick={backButtonAction}>
          {strings.goToReading}
        </s.OrangeButton>
      );
  }

  return (
    <>
      <s.NarrowColumn className="narrowColumn">
        <br />
        <CenteredColumn className="centeredColumn">
          <h1>
            {strings.goodJob} {username}!
          </h1>
        </CenteredColumn>
        <div style={{ marginLeft: "0.5em" }}>
          <p>
            You have reviewed <b>{totalPracticedBookmarksInSession}</b>{" "}
            {Pluralize.word(totalBookmarksReviewed)} in{" "}
            {timeToHumanReadable(checkpointTime)}.
          </p>
          <p>
            {hasScheduledExercises && (
              <b>
                {" "}
                There {Pluralize.is(exerciseNotification.exerciseCounter)}{" "}
                {exerciseNotification.exerciseCounter}{" "}
                {Pluralize.word(exerciseNotification.exerciseCounter)} left to
                exercise today.
              </b>
            )}
          </p>

          {isOverTotalBookmarkLimit && (
            <p>
              You have already <b>{totalBookmarksInPipeline} words</b> you are
              learning at the moment. We recommend that you at{" "}
              <b>most learn {MAX_EXERCISE_IN_LEARNING_BOOKMARKS} words</b> at
              any given point.
            </p>
          )}
          {canStartLearningNewWords && !isOverTotalBookmarkLimit && (
            <p>
              You can start <b>studying new words</b>, do you want to continue
              exercising?
            </p>
          )}
          {!isThereMoreExercises && (
            <p>
              There are no more words for you to practice. You can read more
              articles and find new words to learn!
            </p>
          )}
        </div>
        <CenteredColumn className="CenteredColumn" style={{ marginTop: "2em" }}>
          {progressionButtonRender()}
        </CenteredColumn>
        {articleID && (
          <p>
            You practiced words from: <a href={articleURL}>{articleTitle}</a>
          </p>
        )}

        <br />
        {incorrectBookmarksToDisplay.length > 0 && (
          <CollapsablePanel
            children={incorrectBookmarksToDisplay.map((each) => (
              <s.ContentOnRow className="contentOnRow" key={"row_" + each.id}>
                <Word
                  key={each.id}
                  bookmark={each}
                  notifyDelete={deleteBookmark}
                  api={api}
                  source={source}
                />
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
                <Word
                  key={each.id}
                  bookmark={each}
                  notifyDelete={deleteBookmark}
                  api={api}
                  source={source}
                />
              </s.ContentOnRow>
            ))}
            topMessage={strings.wordsCorrect}
            defaultOpen={true}
          ></CollapsablePanel>
        )}
      </s.NarrowColumn>
    </>
  );
}
