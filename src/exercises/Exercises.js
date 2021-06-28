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
  const [currentBookmarkToStudy, setCurrentBookmarkToStudy] = useState(null);
  const [finished, setFinished] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);
  const [exerciseSession, setExerciseSession] = useState([]);
  const [currentExerciseType, setCurrentExerciseType] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

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
    setSession(bookmarks);
    setTitle(title);
  }

  function setSession(bookmarks) {
    let bookmarkSum = EXERCISES.reduce((a, b) => a + b.requiredBookmarks, 0);
    let batches = parseInt(NUMBER_OF_EXERCISES / bookmarkSum);
    let rest = NUMBER_OF_EXERCISES % bookmarkSum;
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
    setExerciseSession(exercises);
    setBookmarksByExercise(bookmarks, exercises);
  }

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

    if (currentBookmarkToStudy === null) {
      if (session[0].requiredBookmarks > 1) {
        setCurrentBookmarkToStudy(session[0].bookmarks);
      } else {
        setCurrentBookmarkToStudy(session[0].bookmarks[0]);
      }
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

  if (!currentBookmarkToStudy) {
    return <LoadingAnimation />;
  }

  function moveToNextExercise() {
    setIsCorrect(false);
    const newIndex = currentIndex + 1;

    if (newIndex === exerciseSession.length) {
      setFinished(true);
      return;
    }

    if (exerciseSession[newIndex].requiredBookmarks > 1) {
      setCurrentBookmarkToStudy(exerciseSession[newIndex].bookmarks);
    } else {
      setCurrentBookmarkToStudy(exerciseSession[newIndex].bookmarks[0]);
    }

    setCurrentIndex(newIndex);
  }

  function correctAnswer(currentBookmark) {
    if (!incorrectBookmarks.includes(currentBookmark)) {
      setCorrectBookmarks([...correctBookmarks, currentBookmark]);
    }
  }

  function incorrectAnswerNotification(currentBookmark) {
    setIncorrectBookmarks([...incorrectBookmarks, currentBookmark]);
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

  /*Fisher-Yates (aka Knuth) Shuffle - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array*/
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
          bookmarkToStudy={currentBookmarkToStudy}
          correctAnswer={correctAnswer}
          notifyIncorrectAnswer={incorrectAnswerNotification}
          api={api}
          setExerciseType={setCurrentExerciseType}
          isCorrect={isCorrect}
          setIsCorrect={setIsCorrect}
          moveToNextExercise={moveToNextExercise}
          shuffle={shuffle}
        />
      </s.ExForm>

      <br />
      <br />
      <br />

      <FeedbackButtons
        feedbackFunction={stopShowingThisFeedback}
        currentExerciseType={currentExerciseType}
        currentBookmarkToStudy={currentBookmarkToStudy}
      />
    </s.ExercisesColumn>
  );
}
