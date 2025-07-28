import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import Congratulations from "./Congratulations";
import ExerciseSessionProgressBar from "./ExerciseSessionProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import Feature from "../features/Feature";
import { CORRECT, MAX_COOLDOWN_INTERVAL, SOLUTION, WRONG } from "./ExerciseConstants";
import { EXERCISE_TYPES, LEARNING_CYCLE } from "./ExerciseTypeConstants";
import LocalStorage from "../assorted/LocalStorage";
import { assignBookmarksToExercises } from "./assignBookmarksToExercises";
import NextNavigation from "./exerciseTypes/NextNavigation";
import DisableAudioSession from "./exerciseTypes/DisableAudioSession";
import { SpeechContext } from "../contexts/SpeechContext";
import {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXTENDED_SEQUENCE,
  EXTENDED_SEQUENCE_NO_AUDIO,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import { ExercisesCounterContext } from "./ExercisesCounterContext";
import useShadowRef from "../hooks/useShadowRef";
import DigitalTimer from "../components/DigitalTimer";

import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";
import { NarrowColumn } from "../components/ColumnWidth.sc";
import useSubSessionTimer from "../hooks/useSubSessionTimer";
import { APIContext } from "../contexts/APIContext";
import isEmptyDictionary from "../utils/misc/isEmptyDictionary";
import WordProgressBar from "./progressBars/WordProgressBar";
import { getExerciseTypeName } from "./exerciseTypes/exerciseTypeNames";
import { useFeedbackContext } from "../contexts/FeedbackContext";

const BOOKMARKS_DUE_REVIEW = false;

export default function ExerciseSession({ articleID, backButtonAction, toScheduledExercises, source }) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const { setContextualInfo } = useFeedbackContext();

  const [hasKeptExercising, setHasKeptExercising] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState();
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [fullExerciseProgression, setFullExerciseProgression] = useState();

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
  const { hasExerciseNotification, decrementExerciseCounter, hideExerciseCounter } =
    useContext(ExercisesCounterContext);

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

    api.logUserActivity(
      articleID ? api.TO_EXERCISES_AFTER_REVIEW : api.SCHEDULED_EXERCISES_OPEN,
      null,
      JSON.stringify({ had_notification: hasExerciseNotification }),
      "",
    );

    // ========================================
    // GET THE BOOKMARKS THAT ARE TO BE STUDIED
    // ========================================
    resetExerciseSessionState();
    getBookmarksAndAssignThemToExercises();
  }

  function initializeExercisesForBookmarks(bookmarks) {
    if (bookmarks.length === 0) {
      setIsOutOfWordsToday(true);
      return;
    }

    let exerciseSequenceType = getExerciseSequenceType();

    let exerciseSession = assignBookmarksToExercises(bookmarks, exerciseSequenceType);
    setFullExerciseProgression(exerciseSession);

    setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
    setSelectedExerciseBookmark(exerciseSession[0].bookmarks[0]);

    // we have bookmarks; we can start loggign
    api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
      let id = JSON.parse(newlyCreatedDBSessionID).id;
      setDbExerciseSessionId(id);
    });
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
      // TODO: Mircea: Consider creating an endpoint that merges these two
      // calls so we only send a single call
      api.getArticleInfo(articleID, (articleInfo) => {
        api.bookmarksToStudyForArticle(articleID, true, (bookmarks) => {
          hideExerciseCounter(); // for article bookmarks we do not show the counter

          setArticleTitle(articleInfo.title);
          setArticleURL(articleInfo.url);
          setTitle('Exercises for "' + articleInfo.title + '"');
          initializeExercisesForBookmarks(bookmarks);
        });
      });
    } else {
      api.getBookmarksRecommendedForPractice((bookmarks) => initializeExercisesForBookmarks(bookmarks));
      setTitle("Zeeguu: Vocabulary Exercises (𝄂𝄂—𝄂𝄂)", "");
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
    // Clear contextual info from feedback context when leaving exercise session
    setContextualInfo(null);
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

  useEffect(() => {
    if (isOutOfWordsToday) {
      hideExerciseCounter();
    }
  }, [isOutOfWordsToday]);

  // Create shareable URL for current exercise
  const createShareableUrl = () => {
    if (!currentExerciseType) return "";

    const exerciseTypeName = getExerciseTypeName(currentExerciseType);

    // For Match exercises, include all bookmark IDs
    if (exerciseTypeName === "Match" && currentBookmarksToStudy && currentBookmarksToStudy.length > 1) {
      const bookmarkIds = currentBookmarksToStudy.map((b) => b.id).join(",");
      console.log("Creating Match permalink:", {
        exerciseTypeName,
        bookmarkIds,
        bookmarks: currentBookmarksToStudy.length,
      });
      return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkIds}`;
    }

    // For single bookmark exercises
    if (!selectedExerciseBookmark) return "";
    const bookmarkId = selectedExerciseBookmark.id;
    console.log("Creating permalink:", {
      exerciseTypeName,
      bookmarkId,
      word: selectedExerciseBookmark.from,
      translation: selectedExerciseBookmark.to,
    });

    return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkId}`;
  };

  // Update feedback context with current exercise URL
  useEffect(() => {
    const exerciseUrl = createShareableUrl();
    if (exerciseUrl) {
      setContextualInfo({ url: exerciseUrl });
    }
  }, [currentExerciseType, selectedExerciseBookmark, currentBookmarksToStudy, setContextualInfo]);

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
    return <OutOfWordsMessage goBackAction={backButtonAction} />;
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

    if (newIndex === fullExerciseProgression.length) {
      setFinished(true);
      api.getCountOfBookmarksRecommendedForPractice((bookmarkCount) => {
        setIsOutOfWordsToday(bookmarkCount === 0);
      });
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    let nextBookmarkToStudy = fullExerciseProgression[newIndex].bookmarks[0];
    setSelectedExerciseBookmark(nextBookmarkToStudy);
    console.dir(nextBookmarkToStudy);
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
        if (hasExerciseNotification) {
          decrementExerciseCounter();
        }
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
        if (hasExerciseNotification) {
          decrementExerciseCounter();
        }
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

    if (hasExerciseNotification) {
      decrementExerciseCounter();
    }

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

  const wordProgressBar = isExerciseOver ? (
    <WordProgressBar
      bookmark={selectedExerciseBookmark}
      message={currentMessageToAPI}
      isGreyedOutBar={selectedExerciseBookmark === undefined}
    />
  ) : null;

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
            bookmarkProgressBar={wordProgressBar}
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
          {EXERCISE_TYPES.isAudioExercise(currentExerciseType) && SessionStorage.isAudioExercisesEnabled() && !isExerciseOver && (
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
