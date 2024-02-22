import { useEffect, useState } from "react";

import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import { useIdleTimer } from "react-idle-timer";

import { assignBookmarksToExercises } from "./assignBookmarksToExercises";

import {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXERCISE_TYPES_TIAGO,
  NUMBER_OF_BOOKMARKS_TO_PRACTICE,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import ActivityTimer from "../components/ActivityTimer";

export default function Exercises({
  api,
  articleID,
  backButtonAction,
  keepExercisingAction,
  source,
}) {
  const [countBookmarksToPractice, setCountBookmarksToPractice] = useState(
    NUMBER_OF_BOOKMARKS_TO_PRACTICE,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState(null);
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);
  const [fullExerciseProgression, setFullExerciseProgression] = useState([]);
  const [currentExerciseType, setCurrentExerciseType] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [reload, setReload] = useState(false);

  const [dbExerciseSessionId, setDbExerciseSessionId] = useState();

  const [activeSessionDuration, clockActive, setActivityOver] =
    useActivityTimer();

  function getExerciseSequenceType() {
    let exerciseTypesList = EXERCISE_TYPES_TIAGO;
    if (!SessionStorage.isAudioExercisesEnabled()) {
      console.log("Will not use audio!");
      exerciseTypesList = DEFAULT_SEQUENCE_NO_AUDIO;
    }
    return exerciseTypesList;
  }

  function initializeExercises(bookmarks, title) {
    setCountBookmarksToPractice(bookmarks.length);

    if (bookmarks.length > 0) {
      // This can only be initialized here after we can get at least one bookmakr
      // and thus, know the language to pronounce in

      let exerciseSequenceType = getExerciseSequenceType();

      let exerciseSession = assignBookmarksToExercises(
        bookmarks,
        exerciseSequenceType,
      );

      setFullExerciseProgression(exerciseSession);

      if (currentBookmarksToStudy === null) {
        setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
      }

      setTitle(title);
    }
  }

  useEffect(() => {
    if (fullExerciseProgression.length === 0) {
      api.getUserPreferences((preferences) => {
        if (SessionStorage.getAudioExercisesEnabled() === undefined)
          // If the user doesn't go through the login (or has it cached, we need to set it at the start of the exercises.)
          SessionStorage.setAudioExercisesEnabled(
            preferences["audio_exercises"] === undefined ||
              preferences["audio_exercises"] === "true",
          );

        if (articleID) {
          api.bookmarksToStudyForArticle(articleID, (bookmarks) => {
            api.getArticleInfo(articleID, (data) => {
              setArticleInfo(data);
              initializeExercises(
                bookmarks,
                'Exercises for "' + data.title + '"',
              );
            });
          });
        } else {
          api.getUserBookmarksToStudy(
            NUMBER_OF_BOOKMARKS_TO_PRACTICE,
            (bookmarks) => {
              initializeExercises(bookmarks, strings.exercises);
            },
          );
        }
      });
    }

    api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
      let id = JSON.parse(newlyCreatedDBSessionID).id;
      setDbExerciseSessionId(id);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let wordSourceText = articleInfo ? (
    <>
      <a href="#" className="wordSourceText" onClick={backButtonAction}>
        {truncate(articleInfo.title, 40)}
      </a>
    </>
  ) : (
    <>{strings.wordSourceDefaultText}</>
  );

  let wordSourcePrefix = articleInfo ? (
    <>{strings.goBackArticlePrefix}</>
  ) : (
    <>{strings.wordSourcePrefix}</>
  );

  // Standard flow when user completes exercise session
  if (finished) {
    api.logReaderActivity(api.COMPLETED_EXERCISES, articleID, "", source);
    return (
      <>
        <Congratulations
          articleID={articleID}
          correctBookmarks={correctBookmarks}
          incorrectBookmarks={incorrectBookmarks}
          api={api}
          backButtonAction={backButtonAction}
          keepExercisingAction={keepExercisingAction}
          source={source}
          totalTime={activeSessionDuration}
          exerciseSessionId={dbExerciseSessionId}
        />
      </>
    );
  }

  if (!currentBookmarksToStudy && countBookmarksToPractice !== 0) {
    return <LoadingAnimation />;
  }

  if (countBookmarksToPractice === 0) {
    return (
      <OutOfWordsMessage
        message={strings.goToTextsToTranslateWords}
        buttonText="Go to reading"
        buttonAction={backButtonAction}
      />
    );
  }

  function moveToNextExercise() {
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;

    if (newIndex === fullExerciseProgression.length) {
      setFinished(true);
      setActivityOver(true);
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    setCurrentIndex(newIndex);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  let correctBookmarksCopy = [...correctBookmarks];

  function correctAnswerNotification(currentBookmark) {
    if (
      !incorrectBookmarks.includes(currentBookmark) ||
      !incorrectBookmarksCopy.includes(currentBookmark)
    ) {
      correctBookmarksCopy.push(currentBookmark);
      setCorrectBookmarks(correctBookmarksCopy);
    }
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  let incorrectBookmarksCopy = [...incorrectBookmarks];

  function incorrectAnswerNotification(currentBookmark) {
    incorrectBookmarksCopy.push(currentBookmark);
    setIncorrectBookmarks(incorrectBookmarksCopy);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  function uploadUserFeedback(userWrittenFeedback, id) {
    console.log(
      "Sending to the API. Feedback: ",
      userWrittenFeedback,
      " Exercise type: ",
      currentExerciseType,
      " and word: ",
      id,
    );
    setIsCorrect(true);
    api.uploadExerciseFeedback(userWrittenFeedback, currentExerciseType, 0, id);
  }

  function toggleShow() {
    setShowFeedbackButtons(!showFeedbackButtons);
  }

  const CurrentExercise = fullExerciseProgression[currentIndex].type;

  return (
    <>
      <s.ExercisesColumn className="exercisesColumn">
        {/*<s.LittleMessageAbove>*/}
        {/*  {wordSourcePrefix} {wordSourceText}*/}
        {/*</s.LittleMessageAbove>*/}
        <ProgressBar
          index={currentIndex}
          total={fullExerciseProgression.length}
        />
        <s.ExForm>
          <CurrentExercise
            key={currentIndex}
            bookmarksToStudy={currentBookmarksToStudy}
            correctAnswer={correctAnswerNotification}
            notifyIncorrectAnswer={incorrectAnswerNotification}
            api={api}
            setExerciseType={setCurrentExerciseType}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
            moveToNextExercise={moveToNextExercise}
            toggleShow={toggleShow}
            reload={reload}
            setReload={setReload}
            exerciseSessionId={dbExerciseSessionId}
          />
        </s.ExForm>
        <FeedbackDisplay
          showFeedbackButtons={showFeedbackButtons}
          setShowFeedbackButtons={setShowFeedbackButtons}
          currentExerciseType={currentExerciseType}
          currentBookmarksToStudy={currentBookmarksToStudy}
          feedbackFunction={uploadUserFeedback}
        />
      </s.ExercisesColumn>

      <ActivityTimer
        message="Seconds in this exercise session"
        activeSessionDuration={activeSessionDuration}
        clockActive={clockActive}
      />
    </>
  );
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
