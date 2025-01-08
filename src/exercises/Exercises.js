import { useEffect, useState, useContext } from "react";

import Congratulations from "./Congratulations";
import ExerciseSessionProgressBar from "./ExerciseSessionProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import SessionStorage from "../assorted/SessionStorage";
import Feature from "../features/Feature";
import { MAX_COOLDOWN_INTERVAL } from "./ExerciseConstants";
import LocalStorage from "../assorted/LocalStorage";
import { assignBookmarksToExercises } from "./assignBookmarksToExercises";

import {
  DEFAULT_SEQUENCE,
  DEFAULT_SEQUENCE_NO_AUDIO,
  EXTENDED_SEQUENCE,
  EXTENDED_SEQUENCE_NO_AUDIO,
  DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE,
  MAX_NUMBER_OF_BOOKMARKS_EX_SESSION,
} from "./exerciseSequenceTypes";
import useActivityTimer from "../hooks/useActivityTimer";
import { ExerciseCountContext } from "../exercises/ExerciseCountContext";
import useShadowRef from "../hooks/useShadowRef";
import { LEARNING_CYCLE } from "./ExerciseTypeConstants";
import DigitalTimer from "../components/DigitalTimer";

import BackArrow from "../pages/Settings/settings_pages_shared/BackArrow";
import useScreenWidth from "../hooks/useScreenWidth";
import { MOBILE_WIDTH } from "../components/MainNav/screenSize";

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
  const [isOutOfWordsToday, setIsOutOfWordsToday] = useState();
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

  const { screenWidth } = useScreenWidth();

  useEffect(() => {
    setTitle(strings.titleExercises);
    api.getUserPreferences((preferences) => {
      if (SessionStorage.getAudioExercisesEnabled() === undefined)
        // If the user doesn't go through the login (or has it cached, we need to set it at the start of the exercises.)
        SessionStorage.setAudioExercisesEnabled(
          preferences["audio_exercises"] === undefined ||
            preferences["audio_exercises"] === "true",
        );
    });
    api.getTotalBookmarksInPipeline((totalInLearning) => {
      setTotalBookmarksInPipeline(totalInLearning);
    });
    api.startLoggingExerciseSessionToDB((newlyCreatedDBSessionID) => {
      let id = JSON.parse(newlyCreatedDBSessionID).id;
      setDbExerciseSessionId(id);
    });
    setTitle("Exercises");
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
    if (Feature.merle_exercises() || Feature.exercise_levels())
      exerciseTypesList = EXTENDED_SEQUENCE;
    else exerciseTypesList = DEFAULT_SEQUENCE;
    if (!SessionStorage.isAudioExercisesEnabled()) {
      if (Feature.merle_exercises() || Feature.exercise_levels())
        exerciseTypesList = EXTENDED_SEQUENCE_NO_AUDIO;
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
      updateIsOutOfWordsToday();
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
    setIsOutOfWordsToday(false);
    setCountBookmarksToPractice();
    setFullExerciseProgression();
    setCurrentBookmarksToStudy();
    setCorrectBookmarks([]);
    setIncorrectBookmarks([]);
    setFinished(false);
    setCurrentIndex(0);
    setActivityOver(false);
  }

  function updateIsOutOfWordsToday() {
    api.getTopBookmarksToStudy((topBookmarks) => {
      setIsOutOfWordsToday(topBookmarks.length == 0);
    });
  }

  function startExercising() {
    resetExerciseState();
    if (articleID) {
      exercise_article_bookmarks();
    } else {
      api.getTopBookmarksToStudy((bookmarks) => {
        let exerciseSession =
          bookmarks.lengh <= MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            ? MAX_NUMBER_OF_BOOKMARKS_EX_SESSION
            : DEFAULT_NUMBER_BOOKMARKS_TO_PRACTICE;
        initializeExercises(
          bookmarks.slice(0, exerciseSession + 1),
          strings.exercises,
        );
      });
    }
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
          api={api}
          backButtonAction={backButtonAction}
          keepExercisingAction={() => {
            startExercising(BOOKMARKS_DUE_REVIEW);
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

  if (isOutOfWordsToday) {
    return (
      <OutOfWordsMessage
        api={api}
        totalInLearning={totalBookmarksInPipeline}
        goBackAction={backButtonAction}
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
    LocalStorage.setLastExerciseCompleteDate(new Date().toDateString());

    //ML: To think about: Semantically this is strange; Why don't we set it to null? We don't know if it's correct or not
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;
    exerciseNotification.updateReactState();
    if (newIndex === fullExerciseProgression.length) {
      setFinished(true);
      updateIsOutOfWordsToday();
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
        !correctBookmarksIds.includes(currentBookmark.id) &&
        !didItProgressToProductive
      ) {
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
      {screenWidth < MOBILE_WIDTH && <BackArrow />}
      <s.ExercisesColumn className="exercisesColumn">
        <ExerciseSessionProgressBar
          index={currentIndex}
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
    </>
  );
}

function truncate(str, n) {
  // ML: TODO: substr seems to be deprecated; also, this should be moved to some string-utils function?
  // or a new package should be imported?!
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}
