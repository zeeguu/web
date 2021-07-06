import { useEffect, useState } from "react";

import FindWordInContext from "./exerciseTypes/findWordInContext/FindWordInContext";
import MultipleChoice from "./exerciseTypes/multipleChoice/MultipleChoice";
import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";
import * as s from "./Exercises.sc";
import FeedbackButtons from "./FeedbackButtons";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";
import Match from "./exerciseTypes/match/Match";
import strings from "../i18n/definitions";

let BOOKMARKS_TO_PRACTICE = 10;

let BOOKMARKS_FOR_EXERCISE = [
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

export default function Exercises({ api, articleID }) {
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
        api.getUserBookmarksToStudy(BOOKMARKS_TO_PRACTICE, (bookmarks) => {
          initializeExercises(bookmarks, "Exercises");
          console.dir(bookmarks);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initializeExercises(bookmarks, title) {
    BOOKMARKS_TO_PRACTICE = bookmarks.length;
    setCurrentExerciseSession(bookmarks);
    setTitle(title);
  }

  function setCurrentExerciseSession(bookmarks) {
    let bookmarksPerBatch = BOOKMARKS_FOR_EXERCISE.reduce(
      (a, b) => a + b.requiredBookmarks,
      0
    );
    let batchCount = parseInt(BOOKMARKS_TO_PRACTICE / bookmarksPerBatch);
    let remainingExercises = BOOKMARKS_TO_PRACTICE % bookmarksPerBatch;
    let exerciseSequence = defineExerciseSession(
      batchCount,
      remainingExercises
    );
    setExerciseSession(exerciseSequence);
    assignBookmarksToExercises(bookmarks, exerciseSequence);
  }

  function defineExerciseSession(batches, rest) {
    let exerciseSession = [];
    if (BOOKMARKS_TO_PRACTICE < 7) {
      let bookmarks = BOOKMARKS_TO_PRACTICE;
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

  /**The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
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

  if (finished) {
    return (
      <div>
        <Congratulations
          articleID={articleID}
          correctBookmarks={correctBookmarks}
          incorrectBookmarks={incorrectBookmarks}
          api={api}
        />
      </div>
    );
  }

  if (!currentBookmarksToStudy) {
    return <LoadingAnimation />;
  }

  function moveToNextExercise() {
    setIsCorrect(false);
    setShowFeedbackButtons(false);
    const newIndex = currentIndex + 1;

    if (newIndex === exerciseSession.length) {
      setFinished(true);
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

  let wordSourceText = articleInfo ? (
    <>"{articleInfo.title}"</>
  ) : (
    <>{strings.wordSourceDefaultText}</>
  );

  const CurrentExercise = exerciseSession[currentIndex].type;
  return (
    <s.ExercisesColumn>
      <s.LittleMessageAbove>
        {strings.wordSourcePrefix} {wordSourceText}
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
        />
      </s.ExForm>

      <br />
      <br />
      <br />

      <FeedbackButtons
        show={showFeedbackButtons}
        feedbackFunction={stopShowingThisFeedback}
        currentExerciseType={currentExerciseType}
        currentBookmarksToStudy={currentBookmarksToStudy}
      />
    </s.ExercisesColumn>
  );
}
