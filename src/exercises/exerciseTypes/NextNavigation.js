import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditButton from "../../words/EditButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { random } from "../../utils/basic/arrays";
import { useEffect, useState } from "react";
import ProgressionModal from "../ProgressionModal";
import CelebrationModal from "../CelebrationModal";

export default function NextNavigation({
  message,
  bookmarksToStudy,
  moveToNextExercise,
  api,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  handleShowSolution,
}) {
  const correctStrings = [
    strings.correctExercise1,
    strings.correctExercise2,
    strings.correctExercise3,
  ];
  const solutionStrings = [
    strings.solutionExercise1,
    strings.solutionExercise2,
  ];

  const bookmarkToStudy = bookmarksToStudy[0];
  const exercise = "exercise";
  const [userIsCorrect, setUserIsCorrect] = useState();
  const [correctMessage, setCorrectMessage] = useState("");
  const [learningCycle, setLearningCycle] = useState(null);
  const [showProgressionModal, setShowProgressionModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const isUserAndAnswerCorrect = isCorrect && userIsCorrect;
  const productiveExercisesDisabled = localStorage.getItem("productiveExercisesEnabled") === "false";
  const isLastInCycle = bookmarkToStudy.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;
  const isLearningCycleTwo = learningCycle === 2;
  const shouldShowModal = !localStorage.getItem("hideProgressionModal");

  const shouldShowProgressionModal = isUserAndAnswerCorrect && isLearningCycleOne && isLastInCycle && shouldShowModal && !productiveExercisesDisabled;
  const shouldShowCelebrationModal = isUserAndAnswerCorrect && isLastInCycle && (isLearningCycleTwo || (isLearningCycleOne && productiveExercisesDisabled));
  
  useEffect(() => {
    if (bookmarkToStudy && 'learning_cycle' in bookmarkToStudy) {
      setLearningCycle(bookmarkToStudy.learning_cycle);
    }
  }, [bookmarkToStudy]);

  useEffect(() => {
    setLearningCycle(bookmarkToStudy.learning_cycle);
  }, [bookmarkToStudy.learning_cycle]);

  useEffect(() => {
    const userIsCorrect = (message.includes("C"));
    setUserIsCorrect(userIsCorrect);
  }, [message]);

  useEffect(() => {
    if (userIsCorrect) {
      setCorrectMessage(random(correctStrings));
    }
  }, [userIsCorrect]);

  useEffect(() => {
    if (shouldShowProgressionModal) {
      setShowProgressionModal(true);
    }

    if (shouldShowCelebrationModal) {
      setShowCelebrationModal(true);
    }
  }, [shouldShowProgressionModal, shouldShowCelebrationModal]);

  return (
    <>
      <ProgressionModal 
        open={showProgressionModal} 
        onClose={() => setShowProgressionModal(false)} 
        api={api}
      />
      <CelebrationModal
        open={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
      />
      {isUserAndAnswerCorrect && (
        (isLearningCycleOne && isLastInCycle && !productiveExercisesDisabled) ? (
          <div className="next-nav-learning-cycle">
            <img
              src={"/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}&nbsp;{strings.nextLearningCycle}</b>
            </p>
          </div>
        ) : (
          <div className="next-nav-feedback">
            <img
              src={"/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}</b>
            </p>
          </div>
        ))
      }
      {isCorrect && bookmarksToStudy.length === 1 && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.EditSpeakButtonHolder>
            <SpeakButton
              bookmarkToStudy={bookmarkToStudy}
              api={api}
              style="next"
              isReadContext={isReadContext}
            />
            <EditButton
              bookmark={bookmarksToStudy[0]}
              api={api}
              styling={exercise}
              reload={reload}
              setReload={setReload}
            />
          </s.EditSpeakButtonHolder>
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      {isCorrect && bookmarksToStudy.length !== 1 && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      <SolutionFeedbackLinks
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </>
  );
}
