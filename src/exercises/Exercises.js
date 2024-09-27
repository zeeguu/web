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
  MAX_COOLDOWN_INTERVAL,
} from "./ExerciseConstants";

import { assignBookmarksToExercises } from "./assignBookmarksToExercises";

import { isMobile } from "../utils/misc/browserDetection";

import {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  LEARNING_CYCLE_SEQUENCE,
  LEARNING_CYCLE_SEQUENCE_NO_AUDIO,
  DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
  MAX_NUMBER_OF_BOOKMARKS_EX_SESSION,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import ActivityTimer from "../components/ActivityTimer";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import useShadowRef from "../hooks/useShadowRef";
import { LEARNING_CYCLE } from "./ExerciseTypeConstants";

const BOOKMARKS_DUE_REVIEW = false;
const NEW_BOOKMARKS_TO_STUDY = true;

export default function Exercises({
  api,
  articleID,
  backButtonAction,
  source,
}) {
  const [countBookmarksToPractice, setCountBookmarksToPractice] = useState();
  const [hasKeptExercising, setHasKeptExercising] = useState(false);
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
  const [articleTitle, setArticleTitle] = useState();
  const [articleURL, setArticleURL] = useState();
  const [showOutOfWordsMessage, setShowOutOfWordsMessage] = useState();
  const [
    totalPracticedBookmarksInSession,
    setTotalPracticedBookmarksInSession,
  ] = useState(0);

  const [dbExerciseSessionId, setDbExerciseSessionId] = useState();
  const dbExerciseSessionIdRef = useShadowRef(dbExerciseSessionId);
  const currentIndexRef = useShadowRef(currentIndex);
  const hasKeptExercisingRef = useShadowRef(hasKeptExercising);

  const [activeSessionDuration, clockActive, setActivityOver] =
    useActivityTimer();
  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const exerciseNotification = useContext(ExerciseCountContext);
  const [isAbleToAddBookmarksToPipe, setIsAbleToAddBookmarksToPipe] =
    useState();

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
      if (currentIndexRef.current > 0 || hasKeptExercisingRef.current) {
        // Do not report if there was no exercises
        // performed
        api.reportExerciseSessionEnd(
          dbExerciseSessionIdRef.current,
          activeSessionDurationRef.current,
        );
      }
      setActivityOver(true);
      exerciseNotification.unsetExerciseCounter();
      exerciseNotification.updateReactState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    exerciseNotification.updateReactState();
    if (bookmarks.length === 0) {
      // If a user gets here with no bookmarks, means
      // that we tried to schedule new bookmarks but none
      // were found.
      setShowOutOfWordsMessage(true);
      updateIsAbleToAddNewBookmarksToStudy();
      return;
    }
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

  function updateIsAbleToAddNewBookmarksToStudy() {
    api.getNewBookmarksToStudy(1, (new_bookmarks) => {
      setIsAbleToAddBookmarksToPipe(new_bookmarks.length > 0);
    });
  }
  function startExercising(is_new_scheduled_words) {
    resetExerciseState();
    if (is_new_scheduled_words) {
      exercise_new_bookmarks();
    } else {
      if (articleID) {
        exercise_article_bookmarks();
      } else {
        api.hasBookmarksInPipelineToReview((hasBookmarksToPractice) => {
          if (hasBookmarksToPractice) exercise_in_progress_bookmarks();
          else {
            add_new_bookmarks_or_show_out_of_words();
          }
        });
      }
    }
  }

  function exercise_new_bookmarks() {
    api.getNewBookmarksToStudy(
      DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
      (new_bookmarks) => {
        initializeExercises(new_bookmarks, strings.exercises);
      },
    );
  }

  function add_new_bookmarks_or_show_out_of_words() {
    api.getTotalBookmarksInPipeline((totalInLearning) => {
      setTotalBookmarksInPipeline(totalInLearning);
      if (totalInLearning < MAX_EXERCISE_IN_LEARNING_BOOKMARKS) {
        api.getNewBookmarksToStudy(
          DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
          (new_bookmarks) => {
            initializeExercises(new_bookmarks, strings.exercises);
          },
        );
      } else {
        setShowOutOfWordsMessage(true);
        updateIsAbleToAddNewBookmarksToStudy();
      }
    });
  }

  function exercise_article_bookmarks() {
    api.bookmarksToStudyForArticle(articleID, (bookmarks) => {
      api.getArticleInfo(articleID, (data) => {
        exerciseNotification.unsetExerciseCounter();
        initializeExercises(bookmarks, 'Exercises for "' + data.title + '"');
        setArticleTitle(data.title);
        setArticleURL(data.url);
      });
    });
  }

  function exercise_in_progress_bookmarks() {
    // We retrieve the maximum (99) + the ones for the session
    // This is because we update the count in memory
    // and if we have more than 99 + session we would not correctly
    // display the number to the user.
    api.getUserBookmarksToStudy(
      MAX_EXERCISE_TO_DO_NOTIFICATION + DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
      (bookmarks) => {
        exerciseNotification.setExerciseCounter(bookmarks.length);
        let exerciseSession =
          bookmarks.lengh <= MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            ? MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            : DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE;
        initializeExercises(
          bookmarks.slice(0, exerciseSession + 1),
          strings.exercises,
        );
      },
    );
  }
  if (!totalBookmarksInPipeline) {
    api.getTotalBookmarksInPipeline((totalBookmarks) => {
      setTotalBookmarksInPipeline(totalBookmarks);
    });
  }
  // Standard flow when user completes exercise session
  if (finished) {
    return (
      <>
        <Congratulations
          articleID={articleID}
          isAbleToAddBookmarksToPipe={isAbleToAddBookmarksToPipe}
          hasExceededTotalBookmarks={
            totalBookmarksInPipeline >= MAX_EXERCISE_IN_LEARNING_BOOKMARKS
          }
          totalPracticedBookmarksInSession={totalPracticedBookmarksInSession}
          totalBookmarksInPipeline={totalBookmarksInPipeline}
          correctBookmarks={correctBookmarks}
          incorrectBookmarks={incorrectBookmarks}
          api={api}
          backButtonAction={backButtonAction}
          keepExercisingAction={() => {
            startExercising(BOOKMARKS_DUE_REVIEW);
            setHasKeptExercising(true);
          }}
          startExercisingNewWords={() => {
            startExercising(NEW_BOOKMARKS_TO_STUDY);
            setHasKeptExercising(true);
          }}
          source={source}
          exerciseSessionTimer={activeSessionDuration}
          articleURL={articleURL}
          articleTitle={articleTitle}
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
        isAbleToAddBookmarksToPipe={isAbleToAddBookmarksToPipe}
        keepExercisingAction={() => {
          startExercising(NEW_BOOKMARKS_TO_STUDY);
          setHasKeptExercising(true);
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
      updateIsAbleToAddNewBookmarksToStudy();
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    setCurrentIndex(newIndex);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  let correctBookmarksCopy = [...correctBookmarks];

  function correctAnswerNotification(currentBookmark) {
    if (!incorrectBookmarks.includes(currentBookmark)) {
      setTotalPracticedBookmarksInSession(totalPracticedBookmarksInSession + 1);
      let correctBookmarksIds = correctBookmarksCopy.map((b) => b.id);
      let didItProgressToProductive =
        currentBookmark["cooling_interval"] === MAX_COOLDOWN_INTERVAL &&
        currentBookmark.learning_cycle === LEARNING_CYCLE["RECEPTIVE"];
      if (
        currentBookmark["cooling_interval"] !== null &&
        !correctBookmarksIds.includes(currentBookmark.id) &&
        !didItProgressToProductive
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
      setTotalPracticedBookmarksInSession(totalPracticedBookmarksInSession + 1);
      if (currentBookmark["cooling_interval"] > 1) {
        // 8->4, 4->2, 2->1
        // We decrease because you dont have to do it
        // today.
        exerciseNotification.decrementExerciseCounter();
      }
      if (currentBookmark["cooling_interval"] === null) {
        // Bookmark is new, if the user got it wrong it is now scheduled.
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
        {articleID && (
          <p>
            You are practicing words from:{" "}
            <a href={articleURL}>{articleTitle}</a>
          </p>
        )}
      </s.ExercisesColumn>
      {!isMobile() && (
        <ActivityTimer
          message="Total time in this exercise session"
          activeSessionDuration={activeSessionDuration}
          clockActive={clockActive}
        />
      )}
    </>
  );
}

function truncate(str, n) {
  // ML: TODO: substr seems to be deprecated; also, this should be moved to some string-utils function?
  // or a new package should be imported?!
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
