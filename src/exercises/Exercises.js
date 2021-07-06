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

let NUMBER_OF_EXERCISES = 10;
let EXERCISES = [
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
        api.bookmarksForArticle(articleID, (bookmarks) => {
          api.getArticleInfo(articleID, (data) => {
            setArticleInfo(data);
            initializeExercises(
              bookmarks,
              'Exercises for "' + data.title + '"'
            );
          });
        });
      } else {
        api.getUserBookmarksToStudy(NUMBER_OF_EXERCISES, (bookmarks) => {
          initializeExercises(bookmarks, "Exercises");
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initializeExercises(bookmarks, title) {
    NUMBER_OF_EXERCISES = bookmarks.length;
    setCurrentExerciseSession(bookmarks);
    setTitle(title);
  }

  function setCurrentExerciseSession(bookmarks) {
    let bookmarkSum = EXERCISES.reduce((a, b) => a + b.requiredBookmarks, 0);
    let batches = parseInt(NUMBER_OF_EXERCISES / bookmarkSum);
    let rest = NUMBER_OF_EXERCISES % bookmarkSum;
    let exercises = defineExerciseSession(batches, rest);
    setExerciseSession(exercises);
    setBookmarksByExercise(bookmarks, exercises);
  }

  function defineExerciseSession(batches, rest) {
    let exercises = [];
    if (NUMBER_OF_EXERCISES < 7) {
      let bookmarks = NUMBER_OF_EXERCISES;
      while (bookmarks > 0) {
        for (let i = EXERCISES.length - 1; i > 0; i--) {
          if (bookmarks === 0) break;
          let exercise = {
            type: EXERCISES[i].type,
            requiredBookmarks: EXERCISES[i].requiredBookmarks,
            bookmarks: [],
          };
          exercises.push(exercise);
          bookmarks--;
        }
      }
    } else {
      for (let i = 0; i < batches; i++) {
        for (let j = EXERCISES.length - 1; j >= 0; j--) {
          let exercise = {
            type: EXERCISES[j].type,
            requiredBookmarks: EXERCISES[j].requiredBookmarks,
            bookmarks: [],
          };
          exercises.push(exercise);
        }
      }
      while (rest > 0) {
        for (let k = EXERCISES.length - 1; k >= 0; k--) {
          if (rest >= EXERCISES[k].requiredBookmarks) {
            let exercise = {
              type: EXERCISES[k].type,
              requiredBookmarks: EXERCISES[k].requiredBookmarks,
              bookmarks: [],
            };
            exercises.push(exercise);
            rest--;
          }
        }
      }
    }
    return exercises;
  }

  /**The bookmarks fetched by the API are assigned to the various exercises in the defined exercise session --
   * with the required amount of bookmarks assigned to each exercise and the first set of bookmarks set as
   * currentBookmarksToStudy to begin the exercise session.
   */
  function setBookmarksByExercise(bookmarkList, session) {
    let k = 0;
    for (let i = 0; i < session.length; i++) {
      if (session[i].requiredBookmarks > 1) {
        for (let j = i; j < i + session[i].requiredBookmarks; j++) {
          session[i].bookmarks.push(bookmarkList[k]);
          k++;
        }
      } else {
        session[i].bookmarks.push(bookmarkList[k]);
        k++;
      }
    }

    if (currentBookmarksToStudy === null) {
      setCurrentBookmarksToStudy(session[0].bookmarks);
    }
    setExerciseSession(session);
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
