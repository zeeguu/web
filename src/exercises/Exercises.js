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

let NUMBER_OF_EXERCISES = 10;

export default function Exercises({ api, articleID }) {
  const [bookmarksToStudyList, setbookmarksToStudyList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarkToStudy, setCurrentBookmarkToStudy] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);

  useEffect(() => {
    if (!bookmarksToStudyList) {
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
    setbookmarksToStudyList(bookmarks);
    NUMBER_OF_EXERCISES = bookmarks.length;
    setCurrentBookmarkToStudy(bookmarks[currentIndex]);
    setTitle(title);
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
    const newIndex = currentIndex + 1;

    if (newIndex === NUMBER_OF_EXERCISES) {
      setFinished(true);
      return;
    }

    setCurrentIndex(newIndex);
    setCurrentBookmarkToStudy(bookmarksToStudyList[newIndex]);
  }

  function correctAnswer() {
    let currentBookmark = bookmarksToStudyList[currentIndex];

    if (!incorrectBookmarks.includes(currentBookmark)) {
      setCorrectBookmarks([
        ...correctBookmarks,
        bookmarksToStudyList[currentIndex],
      ]);
    }

    moveToNextExercise();
  }

  function incorrectAnswerNotification() {
    setIncorrectBookmarks([
      ...incorrectBookmarks,
      bookmarksToStudyList[currentIndex],
    ]);
  }

  function incorrectAnswerNotificationById(id) {
    bookmarksToStudyList.forEach((bookmark) => {
      if (bookmark.id === id) {
        setIncorrectBookmarks([...incorrectBookmarks, bookmark]);
      }
    });
  }

  function stopShowingThisFeedback(reason) {
    moveToNextExercise();
    api.uploadExerciseFeedback(
      reason,
      "Recognize_L1W_in_L2T",
      0,
      currentBookmarkToStudy.id
    );
    setShowFeedbackButtons(false);
  }

  let wordSourceText = articleInfo ? (
    <>"{articleInfo.title}"</>
  ) : (
    <>your past readings</>
  );

  return (
    <s.ExercisesColumn>
      <s.LittleMessageAbove>Words in {wordSourceText}</s.LittleMessageAbove>
      <ProgressBar index={currentIndex} total={NUMBER_OF_EXERCISES} />

      <s.ExForm>
        {currentIndex % 3 === 0 && (
          <Match
            currentIndex={currentIndex}
            correctAnswer={correctAnswer}
            bookmarksToStudyList={bookmarksToStudyList}
            api={api}
            notifyIncorrectAnswer={incorrectAnswerNotificationById}
          />
        )}
        {currentIndex % 3 === 1 && (
          <MultipleChoice
            bookmarkToStudy={currentBookmarkToStudy}
            correctAnswer={correctAnswer}
            notifyIncorrectAnswer={incorrectAnswerNotification}
            api={api}
          />
        )}
        {currentIndex % 3 === 2 && (
          <FindWordInContext
            bookmarkToStudy={currentBookmarkToStudy}
            correctAnswer={correctAnswer}
            notifyIncorrectAnswer={incorrectAnswerNotification}
            api={api}
          />
        )}
      </s.ExForm>

      <FeedbackButtons
        show={showFeedbackButtons}
        setShow={setShowFeedbackButtons}
        feedbackFunction={stopShowingThisFeedback}
      />
    </s.ExercisesColumn>
  );
}
