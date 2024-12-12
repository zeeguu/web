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
import Pluralize from "../utils/text/pluralize";
import { StyledButton } from "../components/allButtons.sc.js";

export default function Congratulations({
  articleID,
  isOutOfWordsToday,
  totalPracticedBookmarksInSession,
  articleTitle,
  articleURL,
  correctBookmarks,
  incorrectBookmarks,
  api,
  backButtonAction,
  keepExercisingAction,
  toScheduledExercises,
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

  function progressionButtonRender() {
    if (!isOutOfWordsToday)
      return (
        <StyledButton secondary onClick={keepExercisingAction}>
          {strings.keepExercising}
        </StyledButton>
      );
    else
      return (
        <StyledButton secondary onClick={backButtonAction}>
          {strings.goToReading}
        </StyledButton>
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
            <b>{timeToHumanReadable(checkpointTime)}</b>. These words are now
            part of your vocabulary exercises, using spaced repetition and smart
            learning techniques to help you remember them better.
          </p>
          {/*
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
          */}
          {isOutOfWordsToday && (
            <p>
              There are no more words for you to practice. You can read more
              articles and find new words to learn! We will let you know when
              it's time to review your words according to our spaced-repetition
              schedule.
            </p>
          )}
        </div>
        <CenteredColumn
          className="contentOnRow"
          style={{ marginTop: "2em", justifyContent: "space-around" }}
        >
          {progressionButtonRender()}
          <StyledButton primary onClick={toScheduledExercises}>
            {strings.goToExercises}
          </StyledButton>
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
