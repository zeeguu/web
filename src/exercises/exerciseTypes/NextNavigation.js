import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditBookmarkButton from "../../words/EditBookmarkButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { useEffect, useState, useContext } from "react";
import Confetti from "react-confetti";
import SessionStorage from "../../assorted/SessionStorage.js";
import { SpeechContext } from "../../contexts/SpeechContext.js";
import { EXERCISE_TYPES, LEARNING_CYCLE } from "../ExerciseTypeConstants";

import CelebrationModal from "../CelebrationModal";
import { getStaticPath } from "../../utils/misc/staticPath.js";

import Feature from "../../features/Feature";
import { correctnessBasedOnTries } from "../CorrectnessBasedOnTries.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import useBookmarkAutoPronounce from "../../hooks/useBookmarkAutoPronounce.js";
import Pluralize from "../../utils/text/pluralize.js";
import CorrectMessage from "./CorrectMessage";

export default function NextNavigation({
  message: messageForAPI,
  exerciseBookmark: bookmarkBeingTested,

  exerciseAttemptsLog, // Used for exercises like Match which test multiple bookmarks
  moveToNextExercise,
  api,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  handleShowSolution,
  exerciseType,
  isBookmarkChanged,
}) {
  const exercise = "exercise";
  const [userIsCorrect] = useState(correctnessBasedOnTries(messageForAPI));

  const [learningCycle, setLearningCycle] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [autoPronounceBookmark, autoPronounceString, toggleAutoPronounceState] =
    useBookmarkAutoPronounce();
  const speech = useContext(SpeechContext);
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [matchExerciseProgressionMessage, setMatchExercisesProgressionMessage] =
    useState();
  const [matchWordsProgressCount, setMatchWordsProgressCount] = useState(0);
  const [isMatchBookmarkProgression, setIsMatchBookmarkProgression] =
    useState(false);
  const productiveExercisesDisabled =
    LocalStorage.getProductiveExercisesEnabled() === "false";
  const isLastInCycle = bookmarkBeingTested.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;
  const isLearningCycleTwo = learningCycle === 2;
  const learningCycleFeature = Feature.merle_exercises();
  const isMatchExercise = exerciseType === EXERCISE_TYPES.match;
  const isMultiExerciseType =
    EXERCISE_TYPES.isMultiBookmarkExercise(exerciseType);
  const isCorrectMatch = ["CCC"].includes(messageForAPI);

  // TODO: Let's make sure that these two are named as clearly as possible;
  // if one is about actual answer correctness and the other is about correct answer being on screen, this should be clearer
  const isUserAndAnswerCorrect = userIsCorrect && isCorrect;
  const isRightAnswer = messageForAPI.includes("C"); // User has gotten to the right answer, but not necessarily api correct
  const levelsFeature = Feature.exercise_levels();
  const isLastLevel = bookmarkBeingTested.level === 4;

  const bookmarkLearned =
    isUserAndAnswerCorrect &&
    isLastInCycle &&
    ((levelsFeature && isLastLevel) ||
      (learningCycleFeature &&
        (isLearningCycleTwo ||
          (isLearningCycleOne && productiveExercisesDisabled))));
  // amazing!

  // this next one is only for the Merle exercises with two learning cycles
  const bookmarkIsProgressingToNextLearningCycle =
    userIsCorrect &&
    isLearningCycleOne &&
    isLastInCycle &&
    !productiveExercisesDisabled &&
    learningCycleFeature;

  async function handleSpeak() {
    await speech.speakOut(bookmarkBeingTested.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    if (isCorrect && autoPronounceBookmark && !isMatchExercise) handleSpeak();

    if (exerciseAttemptsLog) {
      let wordsProgressed = [];
      for (let i = 0; i < exerciseAttemptsLog.length; i++) {
        let apiMessage = exerciseAttemptsLog[i].messageToAPI;
        let b = exerciseAttemptsLog[i].bookmark;
        let isLastBookmark = exerciseAttemptsLog[i].isLast;
        if (
          b.is_last_in_cycle &&
          apiMessage === "C" &&
          !isLastBookmark &&
          b.learning_cycle === LEARNING_CYCLE["RECEPTIVE"] &&
          learningCycleFeature
        ) {
          wordsProgressed.push(b.from);
          setIsMatchBookmarkProgression(true);
        }
      }
      setMatchExercisesProgressionMessage(
        "'" + wordsProgressed.join("', '") + "'",
      );
      setMatchWordsProgressCount(wordsProgressed.length);
    }
  }, [isCorrect, exerciseAttemptsLog]);

  useEffect(() => {
    if (bookmarkBeingTested && "learning_cycle" in bookmarkBeingTested) {
      setLearningCycle(bookmarkBeingTested.learning_cycle);
    }
  }, [bookmarkBeingTested]);

  useEffect(() => {
    setLearningCycle(bookmarkBeingTested.learning_cycle);
  }, [bookmarkBeingTested.learning_cycle]);

  useEffect(() => {
    if (isDeleted) {
      moveToNextExercise();
    }
  }, [isDeleted]);

  useEffect(() => {
    if (bookmarkLearned && !SessionStorage.isCelebrationModalShown()) {
      setShowCelebrationModal(true);
      SessionStorage.setCelebrationModalShown(true);
    }
  }, [bookmarkLearned]);
  const isExerciseCorrect =
    (isRightAnswer && !isMatchExercise) || isCorrectMatch;

  const showConffetti =
    isUserAndAnswerCorrect &&
    (isMatchBookmarkProgression ||
      bookmarkIsProgressingToNextLearningCycle ||
      bookmarkLearned);

  function celebrationMessageMatch() {
    if (LocalStorage.getProductiveExercisesEnabled()) {
      let verb = Pluralize.has(matchWordsProgressCount);
      return `${verb} now moved to your productive knowledge.`;
    } else {
      let verb = Pluralize.is(matchWordsProgressCount);
      return `${verb} now learned!`;
    }
  }

  return (
    <>
      <>
        <CelebrationModal
          open={showCelebrationModal}
          onClose={() => setShowCelebrationModal(false)}
        />
      </>
      {showConffetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          style={{ position: "fixed" }}
        />
      )}
      {isCorrect && isMatchExercise && isMatchBookmarkProgression && (
        <>
          <div
            className="next-nav-learning-cycle"
            style={{ textAlign: "left" }}
          >
            <img
              src={getStaticPath("icons", "zeeguu-icon-correct.png")}
              alt="Correct Icon"
            />
            <p>
              <b>
                {`${matchExerciseProgressionMessage}`}{" "}
                {celebrationMessageMatch()}
              </b>
            </p>
          </div>
        </>
      )}
      {!isMatchExercise && (
        <>
          {isRightAnswer && bookmarkIsProgressingToNextLearningCycle && (
            <CorrectMessage
              className={"next-nav-learning-cycle"}
              info={strings.nextLearningCycle}
            />
          )}
          {isRightAnswer && bookmarkLearned && (
            <CorrectMessage
              className={"next-nav-learning-cycle"}
              info={strings.wordLearned}
            />
          )}
        </>
      )}
      {isExerciseCorrect &&
        !(bookmarkLearned || bookmarkIsProgressingToNextLearningCycle) && (
          <CorrectMessage className={"next-nav-feedback"} info={""} />
        )}
      {isCorrect && !isMultiExerciseType && (
        <>
          <s.BottomRowSmallTopMargin className="bottomRow">
            <s.EditSpeakButtonHolder>
              <SpeakButton
                bookmarkToStudy={bookmarkBeingTested}
                api={api}
                style="next"
                isReadContext={isReadContext}
                parentIsSpeakingControl={isButtonSpeaking}
              />
              <EditBookmarkButton
                bookmark={bookmarkBeingTested}
                api={api}
                styling={exercise}
                reload={reload}
                setReload={setReload}
                notifyDelete={() => setIsDeleted(true)}
                notifyWordChange={() => isBookmarkChanged()}
              />
            </s.EditSpeakButtonHolder>
            <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
              {strings.next}
            </s.FeedbackButton>
          </s.BottomRowSmallTopMargin>
        </>
      )}
      {isCorrect && isMultiExerciseType && (
        <s.BottomRowSmallTopMargin className="bottomRow">
          <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
            {strings.next}
          </s.FeedbackButton>
        </s.BottomRowSmallTopMargin>
      )}
      {isCorrect && (
        <s.StyledGreyButton
          onClick={toggleAutoPronounceState}
          style={{
            position: "relative",
            bottom: "3em",
            left: "2em",
            textAlign: "start",
          }}
        >
          {"Auto-Pronounce: " + autoPronounceString}
        </s.StyledGreyButton>
      )}
      <SolutionFeedbackLinks
        prefixMsg={`${exerciseType}-(${bookmarkBeingTested.id})`}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isCorrect={isCorrect}
      />
    </>
  );
}
