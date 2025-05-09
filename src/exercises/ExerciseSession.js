import { useEffect, useState, useContext } from "react";

import Congratulations from "./Congratulations";
import ExerciseSessionProgressBar from "./ExerciseSessionProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import Feature from "../features/Feature";
import { CORRECT, MAX_COOLDOWN_INTERVAL, SOLUTION, WRONG } from "./ExerciseConstants";
import { EXERCISE_TYPES } from "./ExerciseTypeConstants";
import LocalStorage from "../assorted/LocalStorage";
import { assignBookmarksToExercises } from "./assignBookmarksToExercises";
import NextNavigation from "./exerciseTypes/NextNavigation";
import DisableAudioSession from "./exerciseTypes/DisableAudioSession";
import { SpeechContext } from "../contexts/SpeechContext";
import {
  DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXTENDED_SEQUENCE,
  EXTENDED_SEQUENCE_NO_AUDIO,
  MAX_NUMBER_OF_BOOKMARKS_EX_SESSION,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import { ExerciseCountContext } from "./ExerciseCountContext";
import useShadowRef from "../hooks/useShadowRef";
import { LEARNING_CYCLE } from "./ExerciseTypeConstants";
import DigitalTimer from "../components/DigitalTimer";

import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import { NarrowColumn } from "../components/ColumnWidth.sc";
import useSubSessionTimer from "../hooks/useSubSessionTimer";
import { APIContext } from "../contexts/APIContext";
import isEmptyDictionary from "../utils/misc/isEmptyDictionary";
import BookmarkProgressBar from "./progressBars/BookmarkProgressBar";

const BOOKMARKS_DUE_REVIEW = false;

export default function ExerciseSession({ articleID, backButtonAction, toScheduledExercises, source }) {
  const api = useContext(APIContext);

  const [hasKeptExercising, setHasKeptExercising] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState();
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [fullExerciseProgression, setFullExerciseProgression] = useState();
  const [totalBookmarksInPipeline, setTotalBookmarksInPipeline] = useState();
  const [currentExerciseType, setCurrentExerciseType] = useState(null);

  // We can use this too states to track if the user is correct.
  // isExerciseOver & !isShownSolution & isCorrect = User Correct
  // isExerciseOver & isShownSolution & isCorrect === null = User Show Solution
  // isExerciseOver & isShownSolution === null & !isCorrect = User Wrong

  const [isCorrect, setIsCorrect] = useState(null);
  const [isExerciseOver, setIsExerciseOver] = useState(false);
  const [isShowSolution, setIsShowSolution] = useState(false);
  const [selectedExerciseBookmark, setSelectedExerciseBookmark] = useState(null);

  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [reload, setReload] = useState(false);
  const [articleTitle, setArticleTitle] = useState();
  const [articleURL, setArticleURL] = useState();
  const [isOutOfWordsToday, setIsOutOfWordsToday] = useState();
  const [totalPracticedBookmarksInSession, setTotalPracticedBookmarksInSession] = useState(0);
  const [exerciseMessageForAPI, setExerciseMessageForAPI] = useState({});
  const [dbExerciseSessionId, setDbExerciseSessionId] = useState();
  const dbExerciseSessionIdRef = useShadowRef(dbExerciseSessionId);
  const currentIndexRef = useShadowRef(currentIndex);
  const hasKeptExercisingRef = useShadowRef(hasKeptExercising);

  const [activeSessionDuration, clockActive, setActivityOver] = useActivityTimer();

  const activeSessionDurationRef = useShadowRef(activeSessionDuration);
  const [getCurrentSubSessionDuration, resetSubSessionTimer] = useSubSessionTimer(activeSessionDurationRef.current);
  const exerciseNotification = useContext(ExerciseCountContext);
  const speech = useContext(SpeechContext);

  const { screenWidth } = useScreenWidth();

  useEffect(() => {
    initializeExerciseSessionComponent();
    return () => {
      cleanupExerciseSessionComponent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ********************************************************************************
  // Component Initialization
  // ********************************************************************************

  function initializeExerciseSessionComponent() {
    api.getUserPreferences((preferences) => {
      if (SessionStorage.getAudioExercisesEnabled() === undefined)
        // If the user doesn't go through the login (or has it cached, we need to set it at the start of the exercises.)
        // TODO: Move the UserContext?
        SessionStorage.setAudioExercisesEnabled(
          preferences["audio_exercises"] === undefined || preferences["audio_exercises"] === "true",
        );
    });

    // this will be needed for when writing the Out of Words today message
    api.getScheduledBookmarksCount((totalInLearning) => {
      setTotalBookmarksInPipeline(totalInLearning);
    });

    api.logUserActivity(
      articleID ? api.TO_EXERCISES_AFTER_REVIEW : api.SCHEDULED_EXERCISES_OPEN,
      null,
      JSON.stringify({ had_notification: exerciseNotification.hasExercises }),
      "",
    );

    resetExerciseSessionState();
    getBookmarksAndAssignThemToExercises();
  }

  function initializeExercisesForBookmarks(bookmarks) {
    exerciseNotification.updateReactState();

    if (bookmarks.length === 0) {
      // If a user gets here with no bookmarks, means
      // that we tried to schedule new bookmarks but none
      // were found.
      updateIsOutOfWordsToday();
      return;
    }

    // we have bookmarks; we can start loggign
    api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
      let id = JSON.parse(newlyCreatedDBSessionID).id;
      setDbExerciseSessionId(id);
    });

    let exerciseSequenceType = getExerciseSequenceType();

    let exerciseSession = assignBookmarksToExercises(bookmarks, exerciseSequenceType);
    setFullExerciseProgression(exerciseSession);

    setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
    setSelectedExerciseBookmark(exerciseSession[0].bookmarks[0]);
  }

  function resetExerciseSessionState() {
    setIsOutOfWordsToday();
    setFullExerciseProgression();
    setCurrentBookmarksToStudy();
    setCorrectBookmarks([]);
    setIncorrectBookmarks([]);
    setFinished(false);
    setCurrentIndex(0);
    setActivityOver(false);
  }

  function getBookmarksAndAssignThemToExercises() {
    if (articleID) {
      api.getArticleInfo(articleID, (articleInfo) => {
        api.bookmarksToStudyForArticle(articleID, true, (bookmarks) => {
          exerciseNotification.unsetExerciseCounter();

          setArticleTitle(articleInfo.title);
          setArticleURL(articleInfo.url);
          setTitle('Exercises for "' + articleInfo.title + '"');
          initializeExercisesForBookmarks(bookmarks);
        });
      });
    } else {
      api.getAllBookmarksAvailableForStudyCount((bookmarkCount) => {
        let exerciseCountInSession =
          bookmarkCount <= MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            ? MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            : DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE;
        api.getAllBookmarksAvailableForStudy(exerciseCountInSession, (bookmarks) =>
          initializeExercisesForBookmarks(bookmarks.slice(0, exerciseCountInSession + 1)),
        );
        setTitle(strings.exercises);
      });
    }
  }

  // ********************************************************************************
  // Component Cleanup
  // ********************************************************************************
  function cleanupExerciseSessionComponent() {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (currentIndexRef.current > 0 || hasKeptExercisingRef.current) {
      // Do not report if there were no exercises
      // performed

      api.reportExerciseSessionEnd(
        // eslint-disable-next-line react-hooks/exhaustive-deps
        dbExerciseSessionIdRef.current,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        activeSessionDurationRef.current,
      );
    }
    setActivityOver(true);
    exerciseNotification.unsetExerciseCounter();
    exerciseNotification.updateReactState();
  }

  function handleUserAttempt(message, bookmarkToUpdate) {
    if (message === "" || !bookmarkToUpdate) return "";
    let _newExerciseMessageToAPI = { ...exerciseMessageForAPI };
    if (!(bookmarkToUpdate.id in _newExerciseMessageToAPI)) {
      _newExerciseMessageToAPI[bookmarkToUpdate.id] = message;
    } else _newExerciseMessageToAPI[bookmarkToUpdate.id] += message;
    setExerciseMessageForAPI(_newExerciseMessageToAPI);
    return _newExerciseMessageToAPI[bookmarkToUpdate.id];
  }

  function getExerciseSequenceType() {
    let exerciseTypesList;
    if (Feature.merle_exercises() || Feature.exercise_levels()) exerciseTypesList = EXTENDED_SEQUENCE;
    else exerciseTypesList = DEFAULT_SEQUENCE;
    if (!SessionStorage.isAudioExercisesEnabled()) {
      if (Feature.merle_exercises() || Feature.exercise_levels()) exerciseTypesList = EXTENDED_SEQUENCE_NO_AUDIO;
      else exerciseTypesList = DEFAULT_SEQUENCE_NO_AUDIO;
    }
    return exerciseTypesList;
  }

  function updateIsOutOfWordsToday() {
    // TODO: why is this depending on allBookmarksAvailableForStudy? It should depend on bookmarks available today!
    api.getAllBookmarksAvailableForStudyCount((bookmarkCount) => {
      setIsOutOfWordsToday(bookmarkCount === 0);
    });
  }

  // Standard flow when user completes exercise session
  if (finished) {
    return (
      <>
        <Congratulations
          articleID={articleID}
          isOutOfWordsToday={isOutOfWordsToday}
          totalPracticedBookmarksInSession={totalPracticedBookmarksInSession}
          correctBookmarks={correctBookmarks}
          incorrectBookmarks={incorrectBookmarks}
          backButtonAction={backButtonAction}
          keepExercisingAction={() => {
            resetExerciseSessionState();
            getBookmarksAndAssignThemToExercises(BOOKMARKS_DUE_REVIEW);
            setHasKeptExercising(true);
          }}
          toScheduledExercises={toScheduledExercises}
          source={source}
          exerciseSessionTimer={activeSessionDuration}
          articleURL={articleURL}
          articleTitle={articleTitle}
        />
      </>
    );
  }

  if (isOutOfWordsToday) {
    return <OutOfWordsMessage totalInLearning={totalBookmarksInPipeline} goBackAction={backButtonAction} />;
  }
  if (!currentBookmarksToStudy || !fullExerciseProgression) {
    return <LoadingAnimation />;
  }

  function moveToNextExercise() {
    speech.stopAudio();
    LocalStorage.setLastExerciseCompleteDate(new Date().toDateString());
    setIsExerciseOver(false);
    setIsShowSolution(null);
    setExerciseMessageForAPI({});
    setIsCorrect(null);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;
    exerciseNotification.updateReactState();
    if (newIndex === fullExerciseProgression.length) {
      setFinished(true);
      updateIsOutOfWordsToday();
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    setSelectedExerciseBookmark(fullExerciseProgression[newIndex].bookmarks[0]);
    setCurrentIndex(newIndex);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  let correctBookmarksCopy = [...correctBookmarks];

  function correctAnswerNotification(currentBookmark, endExercise = true) {
    if (!incorrectBookmarks.includes(currentBookmark)) {
      setTotalPracticedBookmarksInSession(totalPracticedBookmarksInSession + 1);
      let correctBookmarksIds = correctBookmarksCopy.map((b) => b.id);
      let didItProgressToProductive =
        currentBookmark["cooling_interval"] === MAX_COOLDOWN_INTERVAL &&
        currentBookmark.learning_cycle === LEARNING_CYCLE["RECEPTIVE"];
      if (!correctBookmarksIds.includes(currentBookmark.id) && !didItProgressToProductive) {
        exerciseNotification.decrementExerciseCounter();
      }
      correctBookmarksCopy.push(currentBookmark);
      setCorrectBookmarks(correctBookmarksCopy);
    }
    if (endExercise) {
      setIsCorrect(true);
    }
    updateAPIWithExerciseComplete(CORRECT, currentBookmark, endExercise);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  let incorrectBookmarksCopy = [...incorrectBookmarks];

  function updateAPIWithIncorrectAnswer(currentBookmark) {
    let incorrectBookmarksIds = incorrectBookmarksCopy.map((b) => b.id);
    if (!incorrectBookmarksIds.includes(currentBookmark.id)) {
      setTotalPracticedBookmarksInSession(totalPracticedBookmarksInSession + 1);
      if (currentBookmark["cooling_interval"] > 1) {
        exerciseNotification.decrementExerciseCounter();
      }
    }
    incorrectBookmarksCopy.push(currentBookmark);
    setIncorrectBookmarks(incorrectBookmarksCopy);
    handleUserAttempt(WRONG, currentBookmark);
    api.updateExerciseSession(dbExerciseSessionId, activeSessionDuration);
  }

  function showSolution() {
    // Currently, only match results in all bookmarks being marked as wrong.
    let bookmarksToMarkAsWrong =
      currentExerciseType === EXERCISE_TYPES.match
        ? currentBookmarksToStudy.filter((b) => !correctBookmarksCopy.includes(b))
        : [selectedExerciseBookmark];
    for (let i = 0; i < bookmarksToMarkAsWrong.length; i++) {
      let currentBookmark = bookmarksToMarkAsWrong[i];
      updateAPIWithIncorrectAnswer(currentBookmark);
      updateAPIWithExerciseComplete(SOLUTION, currentBookmark);
    }
    setIsShowSolution(true);
  }

  function updateAPIWithExerciseComplete(message, bookmark, endExercise = true) {
    let updated_message = handleUserAttempt(message, bookmark);
    if (endExercise) setIsExerciseOver(true);
    api.uploadExerciseFinalizedData(
      updated_message,
      currentExerciseType,
      getCurrentSubSessionDuration(),
      bookmark ? bookmark.id : null,
      dbExerciseSessionIdRef.current,
    );
  }

  function disableAudio() {
    api.logUserActivity(api.AUDIO_DISABLE, "", selectedExerciseBookmark.id, "");
    moveToNextExercise();
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
    setIsExerciseOver(true);
    exerciseNotification.decrementExerciseCounter();
    api.uploadExerciseFeedback(userWrittenFeedback, currentExerciseType, 0, word_id, dbExerciseSessionId);
  }

  function toggleShow() {
    setShowFeedbackButtons(!showFeedbackButtons);
  }

  // If user shows solution on Match without any selected bookmark, show blank progression.
  let currentMessageToAPI =
    isEmptyDictionary(exerciseMessageForAPI) || (currentExerciseType === EXERCISE_TYPES.match && isShowSolution)
      ? ""
      : exerciseMessageForAPI[selectedExerciseBookmark.id];
  const CurrentExerciseComponent = fullExerciseProgression[currentIndex].type;

  const bookmarkProgressBar = (
    <BookmarkProgressBar
      bookmark={selectedExerciseBookmark}
      message={currentMessageToAPI}
      isGreyedOutBar={selectedExerciseBookmark === undefined}
    />
  );

  return (
    <NarrowColumn>
      <s.ExercisesColumn>
        {screenWidth < MOBILE_WIDTH && <BackArrow />}
        <ExerciseSessionProgressBar
          index={isCorrect ? currentIndex + 1 : currentIndex}
          total={fullExerciseProgression.length}
          clock={
            <DigitalTimer
              activeSessionDuration={activeSessionDuration}
              clockActive={clockActive}
              showClock={false}
              style={{
                width: "3em",
                float: "right",
                margin: "0.25rem 0.15rem",
                color: "grey",
              }}
            ></DigitalTimer>
          }
        />
        <s.ExForm>
          <CurrentExerciseComponent
            key={currentIndex}
            bookmarksToStudy={currentBookmarksToStudy}
            selectedExerciseBookmark={selectedExerciseBookmark}
            setSelectedExerciseBookmark={setSelectedExerciseBookmark}
            exerciseMessageToAPI={currentMessageToAPI}
            notifyOfUserAttempt={handleUserAttempt}
            notifyCorrectAnswer={correctAnswerNotification}
            notifyIncorrectAnswer={updateAPIWithIncorrectAnswer}
            setExerciseType={setCurrentExerciseType}
            notifyExerciseCompleted={updateAPIWithExerciseComplete}
            notifyShowSolution={showSolution}
            isCorrect={isCorrect}
            isExerciseOver={isExerciseOver}
            isShowSolution={isShowSolution}
            setIsCorrect={setIsCorrect}
            setIsExerciseOver={setIsExerciseOver}
            moveToNextExercise={moveToNextExercise}
            toggleShow={toggleShow}
            reload={reload}
            setReload={setReload}
            exerciseSessionId={dbExerciseSessionId}
            activeSessionDuration={activeSessionDuration}
            resetSubSessionTimer={resetSubSessionTimer}
            bookmarkProgressBar={bookmarkProgressBar}
          />
          <NextNavigation
            exerciseType={currentExerciseType}
            bookmarkMessagesToAPI={exerciseMessageForAPI}
            exerciseBookmarks={currentBookmarksToStudy}
            exerciseBookmark={currentBookmarksToStudy[0]}
            moveToNextExercise={moveToNextExercise}
            uploadUserFeedback={uploadUserFeedback}
            reload={reload}
            setReload={setReload}
            handleShowSolution={() => {
              setIsShowSolution(true);
              showSolution();
            }}
            toggleShow={toggleShow}
            isCorrect={isCorrect}
            isExerciseOver={isExerciseOver}
          />
          {EXERCISE_TYPES.isAudioExercise(currentExerciseType) && SessionStorage.isAudioExercisesEnabled() && (
            <DisableAudioSession handleDisabledAudio={disableAudio} setIsCorrect={setIsExerciseOver} />
          )}
        </s.ExForm>
        {articleID && (
          <p>
            You are practicing words from: <a href={articleURL}>{articleTitle}</a>
          </p>
        )}
      </s.ExercisesColumn>
    </NarrowColumn>
  );
}
