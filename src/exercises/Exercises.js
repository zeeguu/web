import { useEffect, useState } from "react";

import FindWordInContext from "./exerciseTypes/findWordInContext/FindWordInContext";
import MultipleChoice from "./exerciseTypes/multipleChoice/MultipleChoice";
import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";
import * as s from "./Exercises.sc";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import strings from "../i18n/definitions";
import Match from "./exerciseTypes/match/Match";
import AudioExerciseOne from "./exerciseTypes/audioExerciseOne/AudioExerciseOne";
import AudioExerciseTwo from "./exerciseTypes/audioExerciseTwo/AudioExerciseTwo";
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";
import QuestionnaireMessage from "../components/QuestionnaireMessage.js";

const DEFAULT_BOOKMARKS_TO_PRACTICE = 18;
let BOOKMARKS_FOR_EXERCISE = [];

if (Feature.audio_exercises())  {
  BOOKMARKS_FOR_EXERCISE = [
    {
      type: Match,
      requiredBookmarks: 3,
    },
    {
      type: AudioExerciseOne,
      requiredBookmarks: 1,
    },
    {
      type: MultipleChoice,
      requiredBookmarks: 1,
    },
    {
      type: AudioExerciseTwo,
      requiredBookmarks: 3,
    },
    {
      type: FindWordInContext,
      requiredBookmarks: 1,
    },
  ];
} else {
  BOOKMARKS_FOR_EXERCISE = [
    {
      type: Match,
      requiredBookmarks: 3,
    },
    {
      type: MultipleChoice,
      requiredBookmarks: 1,
    },
    {
      type: FindWordInContext,
      requiredBookmarks: 1,
    },
  ];
}

export const AUDIO_SOURCE = "Exercises";
export default function Exercises({
  api,
  articleID,
  backButtonAction,
  keepExercisingAction,
  source,
}) {
  const [countBookmarksToPractice, setCountBookmarksToPractice] = useState(
    DEFAULT_BOOKMARKS_TO_PRACTICE
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarksToStudy, setCurrentBookmarksToStudy] = useState(null);
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exerciseSession, setExerciseSession] = useState([]);
  const [currentExerciseType, setCurrentExerciseType] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    console.log("Localstorage displayed questionnaire popup " + LocalStorage.displayedAudioExperimentQuestionnaire());
    console.log("Audio feature flag " + Feature.audio_exercises());
    console.log("Audio completed " + LocalStorage.audioExperimentCompleted());
  }, []);

  useEffect(() => {
    if (exerciseSession.length === 0) {
      if (articleID) {
        api.bookmarksToStudyForArticle(articleID, (bookmarks) => {
          api.getArticleInfo(articleID, (data) => {
            setArticleInfo(data);
            initializeExercises(
              bookmarks,
              'Exercises for "' + data.title + '"'
            );
          });
        });
      } else {
        api.getUserBookmarksToStudy(
          DEFAULT_BOOKMARKS_TO_PRACTICE,
          (bookmarks) => {
            initializeExercises(bookmarks, strings.exercises);
            console.dir(bookmarks);
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initializeExercises(bookmarks, title) {
    setCountBookmarksToPractice(bookmarks.length);
    if (bookmarks.length > 0) {
      calculateExerciseBatches(bookmarks);
      setTitle(title);
    }
  }

  /**
   * Calculates the exercise batches based on the amount of bookmarks received by the API and the amount of
   * bookmarks required per exercise type. A batch contains all exercise types. If there are not enough
   * bookmarks for a full batch, "remainingExercises" holds the amount of exercises requiring a single
   * bookmark to be added to the exercise session.
   *
   * @param bookmarks - passed to function assignBookmarksToExercises(bookmarks, exerciseSequence)
   */
  function calculateExerciseBatches(bookmarks) {
    let bookmarksPerBatch = BOOKMARKS_FOR_EXERCISE.reduce(
      (a, b) => a + b.requiredBookmarks,
      0
    );
    let batchCount = parseInt(bookmarks.length / bookmarksPerBatch);
    let remainingExercises = bookmarks.length % bookmarksPerBatch;
    let exerciseSequence = defineExerciseSession(
      batchCount,
      remainingExercises,
      bookmarks.length
    );
    setExerciseSession(exerciseSequence);
    assignBookmarksToExercises(bookmarks, exerciseSequence);
  }

  function defineExerciseSession(batches, rest, bookmark_count) {
    let exerciseSession = [];
    if (bookmark_count < 7) {
      let bookmarks = bookmark_count;
      while (bookmarks > 0) {
        for (let i = BOOKMARKS_FOR_EXERCISE.length - 1; i > 0; i--) {
          if (bookmarks === 0) break;
          let exercise = {
            type: BOOKMARKS_FOR_EXERCISE[i].type,
            requiredBookmarks: BOOKMARKS_FOR_EXERCISE[i].requiredBookmarks,
            bookmarks: [],
          };
          exerciseSession.push(exercise);
          bookmarks--;
        }
      }
    } else {
      for (let i = 0; i < batches; i++) {
        for (let j = BOOKMARKS_FOR_EXERCISE.length - 1; j >= 0; j--) {
          let exercise = {
            type: BOOKMARKS_FOR_EXERCISE[j].type,
            requiredBookmarks: BOOKMARKS_FOR_EXERCISE[j].requiredBookmarks,
            bookmarks: [],
          };
          exerciseSession.push(exercise);
        }
      }
      while (rest > 0) {
        for (let k = BOOKMARKS_FOR_EXERCISE.length - 1; k >= 0; k--) {
          if (rest >= BOOKMARKS_FOR_EXERCISE[k].requiredBookmarks) {
            let exercise = {
              type: BOOKMARKS_FOR_EXERCISE[k].type,
              requiredBookmarks: BOOKMARKS_FOR_EXERCISE[k].requiredBookmarks,
              bookmarks: [],
            };
            exerciseSession.push(exercise);
            rest--;
          }
        }
      }
    }
    return exerciseSession;
  }

  function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }

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

  /**
   * The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
   * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
   * currentBookmarksToStudy to begin the exercise session.
   */
  function assignBookmarksToExercises(bookmarkList, exerciseSession) {
    let k = 0;
    for (let i = 0; i < exerciseSession.length; i++) {
      if (exerciseSession[i].requiredBookmarks > 1) {
        for (let j = i; j < i + exerciseSession[i].requiredBookmarks; j++) {
          exerciseSession[i].bookmarks.push(bookmarkList[k]);
          k++;
        }
      } else {
        exerciseSession[i].bookmarks.push(bookmarkList[k]);
        k++;
      }
    }

    if (currentBookmarksToStudy === null) {
      setCurrentBookmarksToStudy(exerciseSession[0].bookmarks);
    }
    setExerciseSession(exerciseSession);
  }

  // Standard flow when user completes exercise session
  if (finished) {
    api.logReaderActivity(api.COMPLETED_EXERCISES, articleID, "", source);
    return (
      <>
      <QuestionnaireMessage/>
      <Congratulations
        articleID={articleID}
        correctBookmarks={correctBookmarks}
        incorrectBookmarks={incorrectBookmarks}
        api={api}
        backButtonAction={backButtonAction}
        keepExercisingAction={keepExercisingAction}
        source={source}
      />
      </>
    );
  }

  if (!currentBookmarksToStudy && countBookmarksToPractice !== 0) {
    return <LoadingAnimation />;
  }

  if (countBookmarksToPractice < DEFAULT_BOOKMARKS_TO_PRACTICE) {
    return (
      <OutOfWordsMessage
        message={strings.goToTextsToTranslateWords}
        buttonText={strings.backToReading}
        buttonAction={backButtonAction}
      />
    );
  } 

  function moveToNextExercise() {
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;

    if (newIndex === exerciseSession.length) {
      setFinished(true);
      var completed;
      if (LocalStorage.getTargetNoOfAudioSessions() > 0) {
      LocalStorage.incrementAudioExperimentNoOfSessions();
      completed = LocalStorage.checkAndUpdateAudioExperimentCompleted();
        if (completed) {
          api.logUserActivity(api.AUDIO_EXP, articleID, "Session no: " + LocalStorage.getAudioExperimentNoOfSessions(), AUDIO_SOURCE);
          api.logUserActivity(api.AUDIO_EXP, articleID, "Audio experiment completed!", AUDIO_SOURCE);
        } else {
          api.logUserActivity(api.AUDIO_EXP, articleID, "Session no: " + LocalStorage.getAudioExperimentNoOfSessions(), AUDIO_SOURCE);
        }
      }
      return;
    }
    setCurrentBookmarksToStudy(exerciseSession[newIndex].bookmarks);
    setCurrentIndex(newIndex);
  }

  let correctBookmarksCopy = [...correctBookmarks];
  function correctAnswer(currentBookmark) {
    if (
      !incorrectBookmarks.includes(currentBookmark) ||
      !incorrectBookmarksCopy.includes(currentBookmark)
    ) {
      correctBookmarksCopy.push(currentBookmark);
      setCorrectBookmarks(correctBookmarksCopy);
    }
  }

  let incorrectBookmarksCopy = [...incorrectBookmarks];
  function incorrectAnswerNotification(currentBookmark) {
    incorrectBookmarksCopy.push(currentBookmark);
    setIncorrectBookmarks(incorrectBookmarksCopy);
  }

  function stopShowingThisFeedback(reason, id) {
    console.log(
      "Sending to the API. Feedback: ",
      reason,
      " Exercise type: ",
      currentExerciseType,
      " and word: ",
      id
    );
    setIsCorrect(true);
    api.uploadExerciseFeedback(reason, currentExerciseType, 0, id);
  }

  function toggleShow() {
    setShowFeedbackButtons(!showFeedbackButtons);
  }

  const CurrentExercise = exerciseSession[currentIndex].type;
  return (
    
    <s.ExercisesColumn className="exercisesColumn">
      <s.LittleMessageAbove>
        {wordSourcePrefix} {wordSourceText}
      </s.LittleMessageAbove>
      <ProgressBar index={currentIndex} total={exerciseSession.length} />
      <s.ExForm>
        <CurrentExercise
          bookmarksToStudy={currentBookmarksToStudy}
          correctAnswer={correctAnswer}
          notifyIncorrectAnswer={incorrectAnswerNotification}
          api={api}
          setExerciseType={setCurrentExerciseType}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
          moveToNextExercise={moveToNextExercise}
          toggleShow={toggleShow}
          reload={reload}
          setReload={setReload} />
      </s.ExForm>
      <FeedbackDisplay
        showFeedbackButtons={showFeedbackButtons}
        setShowFeedbackButtons={setShowFeedbackButtons}
        currentExerciseType={currentExerciseType}
        currentBookmarksToStudy={currentBookmarksToStudy}
        feedbackFunction={stopShowingThisFeedback} />
    </s.ExercisesColumn>
  );
}
