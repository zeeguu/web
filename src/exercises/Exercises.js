import { useState } from "react";

import FindWordInContext from "./findWordInContext/FindWordInContext";
import MultipleChoice from "./findWordInContext/MultipleChoice";
import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";

import * as s from "./Exercises.sc";
import FeedbackButtons from "./FeedbackButtons";
import LoadingAnimation from "../components/LoadingAnimation";
import { setTitle } from "../assorted/setTitle";

let NUMBER_OF_EXERCISES = 4;

export default function Exercises({ api, articleID }) {
  const [bookmarksToStudyList, setbookmarksToStudyList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarkToStudy, setCurrentBookmarkToStudy] = useState(null);
  const [otherBookmarksToStudyList, setOtherBookmarksToStudyList] = useState(
    null
  );
  const [finished, setFinished] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);
  const [correctBookmarks, setCorrectBookmarks] = useState([]);
  const [incorrectBookmarks, setIncorrectBookmarks] = useState([]);
  const [articleInfo, setArticleInfo] = useState(null);

  if (!bookmarksToStudyList) {
    if (articleID) {
      // we have an article id ==> we do exercises only for the words in that article

      api.bookmarksForArticle(articleID, (bookmarks) => {
        setbookmarksToStudyList(bookmarks);
        NUMBER_OF_EXERCISES = bookmarks.length;
        setCurrentBookmarkToStudy(bookmarks[currentIndex]);
        setOtherBookmarksToStudyList(filterBookmarks(bookmarks, currentIndex));
        api.getArticleInfo(articleID, (data) => {
          setArticleInfo(data);
          setTitle('Exercises for "' + data.title + '"');
        });
      });
    } else {
      api.getUserBookmarksToStudy(NUMBER_OF_EXERCISES, (bookmarks) => {
        setbookmarksToStudyList(bookmarks);
        NUMBER_OF_EXERCISES = bookmarks.length;
        setCurrentBookmarkToStudy(bookmarks[currentIndex]);
        setOtherBookmarksToStudyList(filterBookmarks(bookmarks, currentIndex));
      });
    }
    setTitle("Exercises");
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

  function filterBookmarks(bookmarks, currentIndex) {
    let filteredBookmarks = bookmarks.filter(
      (_, index) => index !== currentIndex
    );

    return filteredBookmarks;
  }

  function moveToNextExercise() {
    const newIndex = currentIndex + 1;

    if (newIndex === NUMBER_OF_EXERCISES) {
      setFinished(true);
      return;
    }

    setCurrentIndex(newIndex);
    setCurrentBookmarkToStudy(bookmarksToStudyList[newIndex]);
    setOtherBookmarksToStudyList(
      filterBookmarks(bookmarksToStudyList, newIndex)
    );
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
        {currentIndex % 2 === 0 && (
          <FindWordInContext
          bookmarkToStudy={currentBookmarkToStudy}
          correctAnswer={correctAnswer}
          notifyIncorrectAnswer={incorrectAnswerNotification}
          api={api}
        />
        )}
        {currentIndex % 2 === 1 && (
          <MultipleChoice
            bookmarkToStudy={currentBookmarkToStudy}
            otherBookmarksToStudyList={otherBookmarksToStudyList}
            correctAnswer={correctAnswer}
            notifyIncorrectAnswer={incorrectAnswerNotification}
            key={currentBookmarkToStudy.id}
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
