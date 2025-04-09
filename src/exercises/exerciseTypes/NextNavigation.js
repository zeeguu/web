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
import { APIContext } from "../../contexts/APIContext.js";
import { CORRECT } from "../ExerciseConstants.js";

export default function NextNavigation({
  message: messageForAPI,
  exerciseBookmarks,
  exerciseBookmark,
  exerciseAttemptsLog, // Used for exercises like Match which test multiple bookmarks
  moveToNextExercise,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  uploadUserFeedback,
  isExerciseOver,
  handleShowSolution,
  exerciseType,
}) {
  const api = useContext(APIContext);
  const exercise = "exercise";
  const [userIsCorrect] = correctnessBasedOnTries(messageForAPI);
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

  const isLastInCycle = exerciseBookmark.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;
  const learningCycleFeature = Feature.merle_exercises();
  const isMatchExercise = exerciseType === EXERCISE_TYPES.match;
  const isCorrectMatch = ["CCC"].includes(messageForAPI);

  // TODO: Let's make sure that these two are named as clearly as possible;
  // if one is about actual answer correctness and the other is about correct answer being on screen, this should be clearer
  const isUserAndAnswerCorrect = userIsCorrect && isCorrect;
  const bookmarkLearned =
    isUserAndAnswerCorrect && exerciseBookmark.is_about_to_be_learned;

  // this next one is only for the Merle exercises with two learning cycles
  const bookmarkIsProgressingToNextLearningCycle =
    userIsCorrect &&
    isLearningCycleOne &&
    isLastInCycle &&
    !productiveExercisesDisabled &&
    learningCycleFeature;

  async function handleSpeak() {
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
  }

  useEffect(() => {
    if (isExerciseOver && autoPronounceBookmark && !isMatchExercise)
      handleSpeak();

    if (exerciseAttemptsLog) {
      let wordsProgressed = [];
      for (let i = 0; i < exerciseAttemptsLog.length; i++) {
        let apiMessage = exerciseAttemptsLog[i].messageToAPI;
        let b = exerciseAttemptsLog[i].bookmark;
        let isLastBookmark = exerciseAttemptsLog[i].isLast;
        if (
          b.is_last_in_cycle &&
          apiMessage === CORRECT &&
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
    // eslint-disable-next-line
  }, [isExerciseOver, exerciseAttemptsLog]);

  useEffect(() => {
    if (exerciseBookmark && "learning_cycle" in exerciseBookmark) {
      setLearningCycle(exerciseBookmark.learning_cycle);
    }
  }, [exerciseBookmark]);

  useEffect(() => {
    setLearningCycle(exerciseBookmark.learning_cycle);
  }, [exerciseBookmark.learning_cycle]);

  useEffect(() => {
    if (isDeleted) {
      moveToNextExercise();
    }
    // eslint-disable-next-line
  }, [isDeleted]);

  useEffect(() => {
    if (bookmarkLearned && !SessionStorage.isCelebrationModalShown()) {
      setShowCelebrationModal(true);
      SessionStorage.setCelebrationModalShown(true);
    }
  }, [bookmarkLearned]);
  const isExerciseCorrect = (isCorrect && !isMatchExercise) || isCorrectMatch;

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
      <CelebrationModal
        open={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
      />

      {showConffetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          style={{ position: "fixed" }}
        />
      )}
      {isExerciseOver && isMatchExercise && isMatchBookmarkProgression && (
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
          {isCorrect && bookmarkIsProgressingToNextLearningCycle && (
            <CorrectMessage
              className={"next-nav-learning-cycle"}
              info={strings.nextLearningCycle}
            />
          )}
          {isCorrect && bookmarkLearned && (
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
      {isExerciseOver && (
        <>
          <s.BottomRowSmallTopMargin className="bottomRow">
            {!isMatchExercise && (
              <s.EditSpeakButtonHolder>
                <SpeakButton
                  bookmarkToStudy={exerciseBookmark}
                  api={api}
                  styling={"next"}
                  isReadContext={isReadContext}
                  parentIsSpeakingControl={isButtonSpeaking}
                />
                <EditBookmarkButton
                  bookmark={exerciseBookmark}
                  api={api}
                  styling={exercise}
                  reload={reload}
                  setReload={setReload}
                  notifyDelete={() => setIsDeleted(true)}
                />
              </s.EditSpeakButtonHolder>
            )}
            <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
              {strings.next}
            </s.FeedbackButton>
          </s.BottomRowSmallTopMargin>
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
        </>
      )}
      <SolutionFeedbackLinks
        isTestingMultipleBookmarks={isMatchExercise}
        exerciseBookmarks={exerciseBookmarks}
        prefixMsg={`${exerciseType}-(${exerciseBookmark.id})`}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isExerciseOver={isExerciseOver}
        uploadUserFeedback={uploadUserFeedback}
      />
    </>
  );
}
