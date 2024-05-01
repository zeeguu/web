import { useEffect, useState, useContext } from "react";

import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import Feature from "../features/Feature";
import {
  MAX_EXERCISE_IN_LEARNING_BOOKMARKS,
  MAX_EXERCISE_TO_DO_NOTIFICATION,
} from "./ExerciseConstants";

import { assignBookmarksToExercises } from "./assignBookmarksToExercises";

import {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
  NUMBER_OF_BOOKMARKS_TO_PRACTICE,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import ActivityTimer from "../components/ActivityTimer";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import useShadowRef from "../hooks/useShadowRef";

const BOOKMARKS_DUE_REVIEW = false;
const NEW_BOOKMARKS_TO_STUDY = true;

export default function Exercises({
  api,
  articleID,
  backButtonAction,
  source,
}) {
  const [countBookmarksToPractice, setCountBookmarksToPractice] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState();
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [fullExerciseProgression, setFullExerciseProgression] = useState();
  const [totalBookmarksInPipeline, setTotalBookmarksInPipeline] = useState();
  const [currentExerciseType, setCurrentExerciseType] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [reload, setReload] = useState(false);
  const [showOutOfWordsMessage, setShowOutOfWordsMessage] = useState();

  const [dbExerciseSessionId, setDbExerciseSessionId] = useState();
  const dbExerciseSessionIdRef = useShadowRef(dbExerciseSessionId);

  const [activeSessionDuration, clockActive, setActivityOver] =
    useActivityTimer();
  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const exerciseNotification = useContext(ExerciseCountContext);

  function getExerciseSequenceType() {
    let exerciseTypesList;
    if (Feature.merle_exercises()) exerciseTypesList = LEARNING_CYCLE_SEQUENCE;
    else exerciseTypesList = DEFAULT_SEQUENCE;
    if (!SessionStorage.isAudioExercisesEnabled()) {
      if (Feature.merle_exercises())
        exerciseTypesList = LEARNING_CYCLE_SEQUENCE_NO_AUDIO;
      else exerciseTypesList = DEFAULT_SEQUENCE_NO_AUDIO;
    }
    return exerciseTypesList;
  }

  function initializeExercises(bookmarks, title) {
    setCountBookmarksToPractice(bookmarks.length);

    if (bookmarks.length > 0) {
      // This can only be initialized here after we can get at least one bookmark
      // and thus, know the language to pronounce in
      let exerciseSequenceType = getExerciseSequenceType();

      let exerciseSession = assignBookmarksToExercises(
        bookmarks,
        exerciseSequenceType,
      );
      setFullExerciseProgression(exerciseSession);

      setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);

      setTitle(title);
    }
  }
  function resetExerciseState() {
    setShowOutOfWordsMessage(false);
    setCountBookmarksToPractice();
    setFullExerciseProgression();
    setCurrentBookmarksToStudy();
    setCorrectBookmarks([]);
    setIncorrectBookmarks([]);
    setFinished(false);
    setCurrentIndex(0);
    setActivityOver(false);
  }

  function startExercising(is_new_scheduled_words) {
    resetExerciseState();
    if (is_new_scheduled_words) {
      api.getNewBookmarksToStudy(
        NUMBER_OF_BOOKMARKS_TO_PRACTICE,
        (new_bookmarks) => {
          initializeExercises(new_bookmarks, strings.exercises);
        },
      );
    } else {
      api.hasBookmarksInPipelineToReview((hasBookmarksToPractice) => {
        if (hasBookmarksToPractice) exercise_in_progress_bookmarks();
        else {
          api.getTotalBookmarksInPipeline((totalInLearning) => {
            setTotalBookmarksInPipeline(totalInLearning);
            if (totalInLearning < MAX_EXERCISE_IN_LEARNING_BOOKMARKS) {
              api.getNewBookmarksToStudy(
                NUMBER_OF_BOOKMARKS_TO_PRACTICE,
                (new_bookmarks) => {
                  initializeExercises(new_bookmarks, strings.exercises);
                },
              );
            } else setShowOutOfWordsMessage(true);
          });
        }
      });
    }
  }

  function exercise_in_progress_bookmarks() {
    if (articleID) {
      api.bookmarksToStudyForArticle(articleID, (bookmarks) => {
        api.getArticleInfo(articleID, (data) => {
          initializeExercises(bookmarks, 'Exercises for "' + data.title + '"');
        });
      });
    } else {
      // We retrieve the maximum (99) + the ones for the session
      // This is because we update the count in memory
      // and if we have more than 99 + session we would not correctly
      // display the number to the user.
      api.getUserBookmarksToStudy(
        MAX_EXERCISE_TO_DO_NOTIFICATION + NUMBER_OF_BOOKMARKS_TO_PRACTICE,
        (bookmarks) => {
          exerciseNotification.setExerciseCounter(bookmarks.length);
          exerciseNotification.updateReactState();
          initializeExercises(
            bookmarks.slice(0, NUMBER_OF_BOOKMARKS_TO_PRACTICE + 1),
            strings.exercises,
          );
        },
      );
    }
  }

  useEffect(() => {
    api.getUserPreferences((preferences) => {
      if (SessionStorage.getAudioExercisesEnabled() === undefined)
        // If the user doesn't go through the login (or has it cached, we need to set it at the start of the exercises.)
        SessionStorage.setAudioExercisesEnabled(
          preferences["audio_exercises"] === undefined ||
            preferences["audio_exercises"] === "true",
        );
    });
    api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
      let id = JSON.parse(newlyCreatedDBSessionID).id;
      setDbExerciseSessionId(id);
    });

    startExercising();
    return () => {
      api.reportExerciseSessionEnd(
        dbExerciseSessionIdRef.current,
        activeSessionDurationRef.current,
      );
      setActivityOver(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Standard flow when user completes exercise session
  if (finished) {
    return (
      <>
        <Congratulations
          articleID={articleID}
          correctBookmarks={correctBookmarks}
          incorrectBookmarks={incorrectBookmarks}
          api={api}
          backButtonAction={backButtonAction}
          keepExercisingAction={() => {
            startExercising(BOOKMARKS_DUE_REVIEW);
          }}
          source={source}
          totalTime={activeSessionDuration}
        />
      </>
    );
  }

  if (showOutOfWordsMessage) {
    return (
      <OutOfWordsMessage
        api={api}
        totalInLearning={totalBookmarksInPipeline}
        goBackAction={backButtonAction}
        keepExercisingAction={() => {
          startExercising(NEW_BOOKMARKS_TO_STUDY);
        }}
      />
    );
  }
  if (
    !countBookmarksToPractice ||
    !currentBookmarksToStudy ||
    !fullExerciseProgression
  ) {
    return <LoadingAnimation />;
  }

  function moveToNextExercise() {
    //ML: TODO? Semantically this is strange; Why don't we set it to null? We don't know if it's correct or not
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;
    exerciseNotification.updateReactState();
    if (newIndex === fullExerciseProgression.length) {
      setFinished(true);
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    setCurrentIndex(newIndex);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }
  let correctBookmarksCopy = [...correctBookmarks];
  function correctAnswerNotification(currentBookmark) {
    if (!incorrectBookmarks.includes(currentBookmark)) {
      let correctBookmarksIds = correctBookmarksCopy.map((b) => b.id);
      if (
        currentBookmark["cooling_interval"] !== null &&
        !correctBookmarksIds.includes(currentBookmark.id)
      ) {
        // Only decrement if it's already part of the schedule
        exerciseNotification.decrementExerciseCounter();
      }
      correctBookmarksCopy.push(currentBookmark);
      setCorrectBookmarks(correctBookmarksCopy);
    }
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }
  let incorrectBookmarksCopy = [...incorrectBookmarks];
  function incorrectAnswerNotification(currentBookmark) {
    let incorrectBookmarksIds = incorrectBookmarksCopy.map((b) => b.id);
    if (!incorrectBookmarksIds.includes(currentBookmark.id)) {
      if (currentBookmark["cooling_interval"] > 1) {
        // 8->4, 4->2, 2->1
        // We decrease because you dont have to do it
        // today.
        exerciseNotification.decrementExerciseCounter();
      } else {
        // Case 1 and 0 (1 -> 0, 0 stays in zero)
        exerciseNotification.incrementExerciseCounter();
      }
    }
    incorrectBookmarksCopy.push(currentBookmark);
    setIncorrectBookmarks(incorrectBookmarksCopy);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }
  function uploadUserFeedback(userWrittenFeedback, word_id) {
    console.log(
      "Sending to the API. Feedback: ",
      userWrittenFeedback,
      " Exercise type: ",
      currentExerciseType,
      " and word: ",
      word_id,
    );
    setIsCorrect(true);
    exerciseNotification.decrementExerciseCounter();
    api.uploadExerciseFeedback(
      userWrittenFeedback,
      currentExerciseType,
      0,
      word_id,
      dbExerciseSessionId,
    );
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
            notifyCorrectAnswer={correctAnswerNotification}
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
            activeSessionDuration={activeSessionDuration}
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
  // ML: TODO: substr seems to be deprecated; also, this should be moved to some string-utils function?
  // or a new package should be imported?!
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
