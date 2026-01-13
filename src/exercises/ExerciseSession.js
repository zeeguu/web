import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ExerciseSessionProgressBar from "./ExerciseSessionProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import { CORRECT, SOLUTION, WRONG } from "./ExerciseConstants";
import { EXERCISE_TYPES } from "./ExerciseTypeConstants";
import LocalStorage from "../assorted/LocalStorage";
import { assignBookmarksToExercises } from "./assignBookmarksToExercises";
import NextNavigation from "./exerciseTypes/NextNavigation";
import { SpeechContext } from "../contexts/SpeechContext";
import { EXTENDED_SEQUENCE, EXTENDED_SEQUENCE_NO_AUDIO } from "./exerciseSequenceTypes";
import { ExercisesCounterContext } from "./ExercisesCounterContext";
import useShadowRef from "../hooks/useShadowRef";
import useExerciseSession from "../hooks/useExerciseSession";
import DigitalTimer from "../components/DigitalTimer";

import useScreenWidth from "../hooks/useScreenWidth";
import { NarrowColumn } from "../components/ColumnWidth.sc";
import useSubSessionTimer from "../hooks/useSubSessionTimer";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import isEmptyDictionary from "../utils/misc/isEmptyDictionary";
import WordProgressBar from "./progressBars/WordProgressBar";
import { getExerciseTypeName } from "./exerciseTypes/exerciseTypeNames";
import { useFeedbackContext } from "../contexts/FeedbackContext";

const BOOKMARKS_DUE_REVIEW = false;

export default function ExerciseSession({ articleID, backButtonAction, toScheduledExercises, source }) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const { userDetails, userPreferences } = useContext(UserContext);
  const { setContextualInfo } = useFeedbackContext();
  const history = useHistory();

  const [hasKeptExercising, setHasKeptExercising] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState();
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
  const [isSessionLoading, setIsSessionLoading] = useState(true); // New loading state
  const currentIndexRef = useShadowRef(currentIndex);
  const hasKeptExercisingRef = useShadowRef(hasKeptExercising);

  // Exercise session hook - starts when exercises are loaded
  const {
    exerciseSessionId,
    getExerciseSessionId,
    sessionDuration,
    isTimerActive,
  } = useExerciseSession(!!fullExerciseProgression);
  const sessionDurationRef = useShadowRef(sessionDuration);
  const [getCurrentSubSessionDuration, resetSubSessionTimer] = useSubSessionTimer(sessionDurationRef.current);
  const { hasExerciseNotification, decrementExerciseCounter, hideExerciseCounter } =
    useContext(ExercisesCounterContext);

  const { isMobile } = useScreenWidth();

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

  function handleExerciseFocus() {
    api.logUserActivity(api.EXERCISE_FOCUSED, articleID || "", "", source || "");
  }

  function handleExerciseBlur() {
    api.logUserActivity(api.EXERCISE_UNFOCUSED, articleID || "", "", source || "");
  }

  function initializeExerciseSessionComponent() {
    // Use cached preferences from UserContext instead of making an API call
    if (SessionStorage.getAudioExercisesEnabled() === undefined && userPreferences) {
      SessionStorage.setAudioExercisesEnabled(
        userPreferences["audio_exercises"] === undefined || userPreferences["audio_exercises"] === "true",
      );
    }

    api.logUserActivity(
      articleID ? api.TO_EXERCISES_AFTER_REVIEW : api.SCHEDULED_EXERCISES_OPEN,
      null,
      JSON.stringify({ had_notification: hasExerciseNotification }),
      "",
    );

    // Track focus/blur for exercise sessions
    window.addEventListener("focus", handleExerciseFocus);
    window.addEventListener("blur", handleExerciseBlur);

    // ========================================
    // GET THE BOOKMARKS THAT ARE TO BE STUDIED
    // ========================================
    resetExerciseSessionState();
    getBookmarksAndAssignThemToExercises();
  }

  function initializeExercisesForBookmarks(bookmarks) {
    if (bookmarks.length === 0) {
      setIsOutOfWordsToday(true);
      setIsSessionLoading(false); // No exercises to load
      return;
    }

    let exerciseSequenceType = getExerciseSequenceType();

    let exerciseSession = assignBookmarksToExercises(bookmarks, exerciseSequenceType);
    setFullExerciseProgression(exerciseSession);

    setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
    setSelectedExerciseBookmark(exerciseSession[0].bookmarks[0]);

    // Session is now created by useExerciseSession hook when fullExerciseProgression is set
    setIsSessionLoading(false);
  }

  function resetExerciseSessionState() {
    setIsOutOfWordsToday();
    setFullExerciseProgression();
    setCurrentBookmarksToStudy();
    setCorrectBookmarks([]);
    setIncorrectBookmarks([]);
    setCurrentIndex(0);
  }

  function getBookmarksAndAssignThemToExercises() {
    if (articleID) {
      // Fetch article info and words in parallel for faster loading
      const articleInfoPromise = new Promise((resolve) => {
        api.getArticleInfo(articleID, resolve);
      });
      const wordsPromise = new Promise((resolve) => {
        api.wordsToStudyForArticle(articleID, true, resolve);
      });

      Promise.all([articleInfoPromise, wordsPromise]).then(([articleInfo, bookmarks]) => {
        hideExerciseCounter(); // for article bookmarks we do not show the counter

        setArticleTitle(articleInfo.title);
        setArticleURL(articleInfo.url);
        setTitle('Exercises for "' + articleInfo.title + '"');
        initializeExercisesForBookmarks(bookmarks);
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
    // Remove focus/blur event listeners
    window.removeEventListener("focus", handleExerciseFocus);
    window.removeEventListener("blur", handleExerciseBlur);

    // Session end is now handled by useExerciseSession hook on unmount

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
    return SessionStorage.isAudioExercisesEnabled() ? EXTENDED_SEQUENCE : EXTENDED_SEQUENCE_NO_AUDIO;
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
      return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkIds}`;
    }

    // For single bookmark exercises
    if (!selectedExerciseBookmark) return "";
    const bookmarkId = selectedExerciseBookmark.id;

    return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkId}`;
  };

  // Update feedback context with current exercise URL
  useEffect(() => {
    const exerciseUrl = createShareableUrl();
    if (exerciseUrl) {
      setContextualInfo({ url: exerciseUrl });
    }
  }, [currentExerciseType, selectedExerciseBookmark, currentBookmarksToStudy, setContextualInfo]);

  if (isOutOfWordsToday) {
    const hasAnyWords = (userDetails?.bookmark_count || 0) > 0;
    return <OutOfWordsMessage hasAnyWords={hasAnyWords} />;
  }

  // Show loading screen until session is created and bookmarks are loaded
  if (!currentBookmarksToStudy || !fullExerciseProgression || isSessionLoading) {
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
      // Navigate to the summary page with session data
      api.getCountOfBookmarksRecommendedForPractice((bookmarkCount) => {
        history.push("/exercises/summary", {
          articleID,
          isOutOfWordsToday: bookmarkCount === 0,
          totalPracticedBookmarksInSession: totalPracticedBookmarksInSession,
          correctBookmarks: correctBookmarks,
          incorrectBookmarks: incorrectBookmarks,
          exerciseSessionTimer: sessionDuration,
          articleURL,
          articleTitle,
          source,
        });
      });
      return;
    }
    setCurrentBookmarksToStudy(fullExerciseProgression[newIndex].bookmarks);
    let nextBookmarkToStudy = fullExerciseProgression[newIndex].bookmarks[0];
    setSelectedExerciseBookmark(nextBookmarkToStudy);
    setCurrentIndex(newIndex);
  }

  let correctBookmarksCopy = [...correctBookmarks];

  function correctAnswerNotification(currentBookmark, endExercise = true) {
    if (!incorrectBookmarks.includes(currentBookmark)) {
      setTotalPracticedBookmarksInSession(totalPracticedBookmarksInSession + 1);
      let correctBookmarksIds = correctBookmarksCopy.map((b) => b.id);

      if (!correctBookmarksIds.includes(currentBookmark.id)) {
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
      bookmark ? bookmark.user_word_id : null,
      getExerciseSessionId(),
    );
  }

  function disableAudio() {
    api.logUserActivity(api.AUDIO_DISABLE, "", selectedExerciseBookmark.id, "");
    moveToNextExercise();
  }

  function onWordRemovedFromExercises(reason, word_id) {
    setIsExerciseOver(true);

    if (hasExerciseNotification) {
      decrementExerciseCounter();
    }

    api.uploadExerciseFeedback(reason, currentExerciseType, 0, word_id, exerciseSessionId);
  }

  function handleExampleUpdate(updateData) {
    if (!updateData.updatedBookmark) {
      return;
    }

    const updatedBookmark = updateData.updatedBookmark;

    // Validate that context_tokenized exists and is properly formatted
    if (!updatedBookmark.context_tokenized || !Array.isArray(updatedBookmark.context_tokenized)) {
      return;
    }

    // Update the current exercise with the returned bookmark data
    let updatedProgression = [...fullExerciseProgression];
    const currentBookmarkIndex = updatedProgression[currentIndex].bookmarks.findIndex(
      (b) => b.id === selectedExerciseBookmark.id,
    );

    if (currentBookmarkIndex !== -1) {
      updatedProgression[currentIndex].bookmarks[currentBookmarkIndex] = updatedBookmark;
      setFullExerciseProgression(updatedProgression);
      setCurrentBookmarksToStudy(updatedProgression[currentIndex].bookmarks);
      setSelectedExerciseBookmark(updatedBookmark);

      setTimeout(() => {
        setReload(!reload);
      }, 100);
    }
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
        <div id="exerciseTopbar">
          <div id="topbarRow">
            {userDetails?.name === "Mircea" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.8rem",
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                {getExerciseTypeName(currentExerciseType)}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
              <DigitalTimer
                sessionDuration={sessionDuration}
                isTimerActive={isTimerActive}
                showClock={false}
                style={{
                  width: "3em",
                  color: "grey",
                }}
              />
            </div>
          </div>
          <ExerciseSessionProgressBar
            index={isCorrect ? currentIndex + 1 : currentIndex}
            total={fullExerciseProgression.length}
            style={{ display: "none" }}
          />
        </div>
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
            exerciseSessionId={exerciseSessionId}
            activeSessionDuration={sessionDuration}
            resetSubSessionTimer={resetSubSessionTimer}
            bookmarkProgressBar={wordProgressBar}
            onExampleUpdated={handleExampleUpdate}
          />
          <NextNavigation
            exerciseType={currentExerciseType}
            bookmarkMessagesToAPI={exerciseMessageForAPI}
            exerciseBookmarks={currentBookmarksToStudy}
            exerciseBookmark={currentBookmarksToStudy[0]}
            moveToNextExercise={moveToNextExercise}
            onWordRemovedFromExercises={onWordRemovedFromExercises}
            reload={reload}
            setReload={setReload}
            handleShowSolution={() => {
              setIsShowSolution(true);
              showSolution();
            }}
            toggleShow={toggleShow}
            isCorrect={isCorrect}
            isExerciseOver={isExerciseOver}
            disableAudio={disableAudio}
            setIsExerciseOver={setIsExerciseOver}
            onExampleUpdated={handleExampleUpdate}
          />
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
