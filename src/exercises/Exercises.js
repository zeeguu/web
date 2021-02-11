import { useState } from "react";

import FindWordInContext from "./recognize/FindWordInContext";
import Congratulations from "./Congratulations";
import ProgressBar from "./ProgressBar";

import * as s from "./Exercises.sc";
import FeedbackButtons from "./FeedbackButtons";
import LoadingAnimation from "../components/LoadingAnimation";

const NUMBER_OF_EXERCISES = 4;

export default function Exercises({ api }) {
  const [bookmarksToStudyList, setbookmarksToStudyList] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBookmarkToStudy, setCurretBookmarkToStudy] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showFeedbackButtons, setShowFeedbackButtons] = useState(false);

  if (!bookmarksToStudyList) {
    api.getUserBookmarksToStudy(NUMBER_OF_EXERCISES, (bookmarks) => {
      setbookmarksToStudyList(bookmarks);
      setCurretBookmarkToStudy(bookmarks[currentIndex]);
    });
  }

  if (finished) {
    return (
      <div>
        <Congratulations />
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
    setCurretBookmarkToStudy(bookmarksToStudyList[newIndex]);
  }
  function correctAnswer() {
    moveToNextExercise();
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

  return (
    <s.ExercisesColumn>
      <ProgressBar index={currentIndex} total={NUMBER_OF_EXERCISES} />

      <s.ExForm>
        <FindWordInContext
          bookmarkToStudy={currentBookmarkToStudy}
          correctAnswer={correctAnswer}
          key={currentBookmarkToStudy.id}
          api={api}
        />
      </s.ExForm>

      <FeedbackButtons
        show={showFeedbackButtons}
        setShow={setShowFeedbackButtons}
        feedbackFunction={stopShowingThisFeedback}
      />
    </s.ExercisesColumn>
  );
}
