import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditButton from "../../words/EditButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { random } from "../../utils/basic/arrays";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import SessionStorage from "../../assorted/SessionStorage.js";
import { exerciseTypes } from "../ExerciseTypeConstants";

import CelebrationModal from "../CelebrationModal";
import { APP_DOMAIN } from "../../i18n/appConstants.js";

import Feature from "../../features/Feature";
import { ExerciseValidation } from "../ExerciseValidation.js";

export default function NextNavigation({
  message,
  exerciseBookmark,
  moveToNextExercise,
  api,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  handleShowSolution,
  exerciseType,
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

  const exercise = "exercise";
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [rightAnswer, setRightAnswer] = useState();
  const [correctMessage, setCorrectMessage] = useState("");
  const [learningCycle, setLearningCycle] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const isUserAndAnswerCorrect = isCorrect && rightAnswer;
  const productiveExercisesDisabled =
    localStorage.getItem("productiveExercisesEnabled") === "false";
  const isLastInCycle = exerciseBookmark.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;
  const isLearningCycleTwo = learningCycle === 2;
  const learningCycleFeature = Feature.merle_exercises();
  const isMatchExercise = exerciseType === exerciseTypes.match;
  const isMultiExerciseType =
    exerciseTypes.isMultiBookmarkExercise(exerciseType);
  const isCorrectMatch = ["CCC"].includes(message);

  const bookmarkLearned =
    isUserAndAnswerCorrect &&
    isLastInCycle &&
    (!isMatchExercise || (isMatchExercise && isCorrectMatch)) &&
    (isLearningCycleTwo || (isLearningCycleOne && productiveExercisesDisabled));

  const bookmarkProgression =
    userIsCorrect &&
    isLearningCycleOne &&
    isLastInCycle &&
    (!isMatchExercise || (isMatchExercise && isCorrectMatch)) &&
    !productiveExercisesDisabled &&
    learningCycleFeature;

  useEffect(() => {
    if (exerciseBookmark && "learning_cycle" in exerciseBookmark) {
      setLearningCycle(exerciseBookmark.learning_cycle);
    }
  }, [exerciseBookmark]);

  useEffect(() => {
    setLearningCycle(exerciseBookmark.learning_cycle);
  }, [exerciseBookmark.learning_cycle]);

  useEffect(() => {
    const { userIsCorrect } = ExerciseValidation(message);
    setUserIsCorrect(userIsCorrect);
  }, [message]);

  useEffect(() => {
    const rightAnswer = message.includes("C");
    setRightAnswer(rightAnswer);
  }, [message]);

  useEffect(() => {
    if (rightAnswer) {
      setCorrectMessage(random(correctStrings));
    }
  }, [rightAnswer]);

  useEffect(() => {
    if (bookmarkLearned && !SessionStorage.isCelebrationModalShown()) {
      setShowCelebrationModal(true);
      SessionStorage.setCelebrationModalShown(true);
    }
  }, [bookmarkLearned]);

  return (
    <>
      {learningCycleFeature && (
        <>
          <CelebrationModal
            open={showCelebrationModal}
            onClose={() => setShowCelebrationModal(false)}
          />
        </>
      )}
      {rightAnswer &&
        (!isMatchExercise || isCorrectMatch) &&
        (bookmarkProgression ? (
          <div className="next-nav-learning-cycle">
            <img
              src={APP_DOMAIN + "/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage + " " + strings.nextLearningCycle}</b>
            </p>
          </div>
        ) : bookmarkLearned ? (
          <>
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
            <div className="next-nav-learning-cycle">
              <img
                src={APP_DOMAIN + "/static/icons/zeeguu-icon-correct.png"}
                alt="Correct Icon"
              />
              <p>
                <b>{correctMessage + " " + strings.wordLearned}</b>
              </p>
            </div>
          </>
        ) : (
          <div className="next-nav-feedback">
            <img
              src={APP_DOMAIN + "/static/icons/zeeguu-icon-correct.png"}
              alt="Correct Icon"
            />
            <p>
              <b>{correctMessage}</b>
            </p>
          </div>
        ))}
      {isCorrect && !isMultiExerciseType && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.EditSpeakButtonHolder>
            <SpeakButton
              bookmarkToStudy={exerciseBookmark}
              api={api}
              style="next"
              isReadContext={isReadContext}
            />
            <EditButton
              bookmark={exerciseBookmark}
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
      {isCorrect && isMultiExerciseType && (
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
