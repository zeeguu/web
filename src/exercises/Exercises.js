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
import SpellWhatYouHear from "./exerciseTypes/spellWhatYouHear/SpellWhatYouHear";
import MultipleChoiceAudio from "./exerciseTypes/multipleChoiceAudio/MultipleChoiceAudio";
import OrderWords from "./exerciseTypes/orderWords/OrderWords"
import FeedbackDisplay from "./bottomActions/FeedbackDisplay";
import OutOfWordsMessage from "./OutOfWordsMessage";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage";

const DEFAULT_BOOKMARKS_TO_PRACTICE = 10;
let EXERCISE_TYPES = [
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
  {
    type: SpellWhatYouHear,
    requiredBookmarks: 1,
  },
  {
    type: MultipleChoiceAudio,
    requiredBookmarks: 3,
  },
];

let EXERCISE_TYPES_TIAGO = [
  {
    type: OrderWords,
    requiredBookmarks: 1,
  }
];



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
    let exerciseTypesList = EXERCISE_TYPES;
    if (Feature.tiago_exercises()){
      exerciseTypesList = EXERCISE_TYPES_TIAGO;
    }
    let bookmarksPerBatch = exerciseTypesList.reduce(
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
    let exerciseTypesList = EXERCISE_TYPES
    if (Feature.tiago_exercises()){
      exerciseTypesList = EXERCISE_TYPES_TIAGO
    }
    let exerciseSession = [];
    if (bookmark_count < 9) {
      let count = bookmark_count;
      while (count > 0) {
        for (let i = exerciseTypesList.length - 1; i >= 0; i--) {
          let currentTypeRequiredCount = exerciseTypesList[i].requiredBookmarks;
          if (count < currentTypeRequiredCount) continue;
          if (count === 0) break;
          let exercise = {
            type: exerciseTypesList[i].type,
            requiredBookmarks: currentTypeRequiredCount,
            bookmarks: [],
          };
          exerciseSession.push(exercise);
          count = count - currentTypeRequiredCount;
        }
      }
    } else {
      for (let i = 0; i < batches; i++) {
        for (let j = exerciseTypesList.length - 1; j >= 0; j--) {
          let exercise = {
            type: exerciseTypesList[j].type,
            requiredBookmarks: exerciseTypesList[j].requiredBookmarks,
            bookmarks: [],
          };
          exerciseSession.push(exercise);
        }
      }
      while (rest > 0) {
        for (let k = exerciseTypesList.length - 1; k >= 0; k--) {
          if (rest >= exerciseTypesList[k].requiredBookmarks) {
            let exercise = {
              type: exerciseTypesList[k].type,
              requiredBookmarks: exerciseTypesList[k].requiredBookmarks,
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

  if (countBookmarksToPractice === 0) {
    return (
      <OutOfWordsMessage
        message={strings.goToTextsToTranslateWords}
        buttonText={strings.backToReading}
        buttonAction={backButtonAction}
      />
    );
  }

  function exerciseSessionWithAudioCompleted() {
    var completed;
    if (Feature.audio_exercises()) {
      if (LocalStorage.getTargetNoOfAudioSessions() > 0) {
        LocalStorage.incrementAudioExperimentNoOfSessions();
        completed = LocalStorage.checkAndUpdateAudioExperimentCompleted();
        if (completed) {
          api.logUserActivity(
            api.AUDIO_EXP,
            articleID,
            "Session no: " + LocalStorage.getAudioExperimentNoOfSessions(),
            AUDIO_SOURCE
          );
          api.logUserActivity(
            api.AUDIO_EXP,
            articleID,
            "Audio experiment completed!",
            AUDIO_SOURCE
          );
        } else {
          api.logUserActivity(
            api.AUDIO_EXP,
            articleID,
            "Session no: " + LocalStorage.getAudioExperimentNoOfSessions(),
            AUDIO_SOURCE
          );
        }
      } else {
        LocalStorage.setAudioExperimentNoOfSessions("1");
        api.logUserActivity(
          api.AUDIO_EXP,
          articleID,
          "First session completed ",
          AUDIO_SOURCE
        );
        LocalStorage.setTargetNoOfAudioSessions("100");
      }
    }
    return;
  }

  function exerciseSessionNoAudioCompleted() {
    var completed;
    if (LocalStorage.getTargetNoOfAudioSessions() > 0) {
      LocalStorage.incrementAudioExperimentNoOfSessions();
      completed = LocalStorage.checkAndUpdateAudioExperimentCompleted();
      if (completed) {
        api.logUserActivity(
          api.AUDIO_EXP,
          articleID,
          "Session without audio no: " +
            LocalStorage.getAudioExperimentNoOfSessions(),
          AUDIO_SOURCE
        );
        api.logUserActivity(
          api.AUDIO_EXP,
          articleID,
          "Experiment without audio completed!",
          AUDIO_SOURCE
        );
      } else {
        api.logUserActivity(
          api.AUDIO_EXP,
          articleID,
          "Session no: " + LocalStorage.getAudioExperimentNoOfSessions(),
          AUDIO_SOURCE
        );
      }
    } else {
      LocalStorage.setAudioExperimentNoOfSessions("1");
      api.logUserActivity(
        api.AUDIO_EXP,
        articleID,
        "First session without audio completed ",
        AUDIO_SOURCE
      );
      LocalStorage.setTargetNoOfAudioSessions("100");
    }
    return;
  }

  function moveToNextExercise() {
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;

    if (newIndex === exerciseSession.length) {
      setFinished(true);
      if (Feature.audio_exercises()) {
        exerciseSessionWithAudioCompleted();
      } else if (Feature.no_audio_exercises()) {
        exerciseSessionNoAudioCompleted();
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

  function uploadUserFeedback(userWrittenFeedback, id) {
    console.log(
      "Sending to the API. Feedback: ",
      userWrittenFeedback,
      " Exercise type: ",
      currentExerciseType,
      " and word: ",
      id
    );
    setIsCorrect(true);
    api.uploadExerciseFeedback(userWrittenFeedback, currentExerciseType, 0, id);
  }

  function toggleShow() {
    setShowFeedbackButtons(!showFeedbackButtons);
  }

  const CurrentExercise = exerciseSession[currentIndex].type;
  return (
    <s.ExercisesColumn className="exercisesColumn">
      {/*<s.LittleMessageAbove>*/}
      {/*  {wordSourcePrefix} {wordSourceText}*/}
      {/*</s.LittleMessageAbove>*/}
      <ProgressBar index={currentIndex} total={exerciseSession.length} />
      <s.ExForm>
        <CurrentExercise
          key={currentIndex}
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
          setReload={setReload}
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
  );
}
