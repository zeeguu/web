import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditBookmarkButton from "../../words/EditBookmarkButton";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { getExerciseTypeName } from "../exerciseTypes/exerciseTypeNames";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import SessionStorage from "../../assorted/SessionStorage.js";
import { SpeechContext } from "../../contexts/SpeechContext.js";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";

import CelebrationModal from "../CelebrationModal";
import { getStaticPath } from "../../utils/misc/staticPath.js";
import { correctnessBasedOnTries } from "../CorrectnessBasedOnTries.js";
import LocalStorage from "../../assorted/LocalStorage.js";
import useBookmarkAutoPronounce from "../../hooks/useBookmarkAutoPronounce.js";
import Pluralize from "../../utils/text/pluralize.js";
import CorrectMessage from "./CorrectMessage";
import { APIContext } from "../../contexts/APIContext.js";
import isEmptyDictionary from "../../utils/misc/isEmptyDictionary.js";
import useScreenWidth from "../../hooks/useScreenWidth.js";
import FeedbackModal from "../../components/FeedbackModal.js";
import { FEEDBACK_OPTIONS } from "../../components/FeedbackConstants.js";
import AutoPronounceToggle from "../../components/AutoPronounceToggle.js";

export default function NextNavigation({
  bookmarkMessagesToAPI,
  exerciseBookmarks,
  exerciseBookmark,
  moveToNextExercise,
  reload,
  setReload,
  isReadContext,
  toggleShow,
  isCorrect,
  onWordRemovedFromExercises,
  isExerciseOver,
  handleShowSolution,
  exerciseType,
  nextButtonText,
  disableAudio,
  setIsExerciseOver,
  onExampleUpdated,
}) {
  const messageForAPI = isEmptyDictionary(bookmarkMessagesToAPI) ? "" : bookmarkMessagesToAPI[exerciseBookmark.id];
  const api = useContext(APIContext);
  const exercise = "exercise";
  const [userIsCorrect] = correctnessBasedOnTries(messageForAPI);
  const [learningCycle, setLearningCycle] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [autoPronounceBookmark, autoPronounceString, toggleAutoPronounceState] = useBookmarkAutoPronounce();
  const speech = useContext(SpeechContext);
  const [isButtonSpeaking, setIsButtonSpeaking] = useState(false);
  const [isAutoPronouncing, setIsAutoPronouncing] = useState(false);
  const [matchExerciseProgressionMessage, setMatchExercisesProgressionMessage] = useState();
  const [matchWordsProgressCount, setMatchWordsProgressCount] = useState(0);
  const [isMatchBookmarkProgression, setIsMatchBookmarkProgression] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { isMobile } = useScreenWidth();
  const productiveExercisesDisabled = LocalStorage.getProductiveExercisesEnabled() === "false";

  const isLastInCycle = exerciseBookmark.is_last_in_cycle;
  const isLearningCycleOne = learningCycle === 1;

  const isMatchExercise = exerciseType === EXERCISE_TYPES.match;

  const isCorrectMatch = isMatchExercise && ["CCC"].includes(Object.values(bookmarkMessagesToAPI).join(""));

  // TODO: Let's make sure that these two are named as clearly as possible;
  // if one is about actual answer correctness and the other is about correct answer being on screen, this should be clearer
  const isUserAndAnswerCorrect = userIsCorrect && isCorrect;
  const bookmarkLearned = isUserAndAnswerCorrect && exerciseBookmark.is_about_to_be_learned;

  async function handleSpeak() {
    setIsAutoPronouncing(true);
    await speech.speakOut(exerciseBookmark.from, setIsButtonSpeaking);
    // Add 200ms delay to ensure speech has fully started before enabling button
    setTimeout(() => {
      setIsAutoPronouncing(false);
    }, 500);
  }

  useEffect(() => {
    // Auto-pronounce the correct word after exercise completion when enabled
    if (isExerciseOver && autoPronounceBookmark && !isMatchExercise) handleSpeak();

    // eslint-disable-next-line
  }, [isExerciseOver]);

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

  // Create shareable URL for feedback purposes
  const createShareableUrl = () => {
    const exerciseTypeName = getExerciseTypeName(exerciseType);

    // For multi-bookmark exercises (Match, MultipleChoice, MultipleChoiceContext), include all bookmark IDs
    if (EXERCISE_TYPES.isMultiBookmarkExercise(exerciseType) && exerciseBookmarks && exerciseBookmarks.length > 1) {
      const bookmarkIds = exerciseBookmarks.map((b) => b.id).join(",");
      return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkIds}`;
    }

    // For single bookmark exercises
    if (!exerciseBookmark) return "";
    const bookmarkId = exerciseBookmark.id;
    return `${window.location.origin}/exercise/${exerciseTypeName}/${bookmarkId}`;
  };

  const showConffetti = isUserAndAnswerCorrect && (isMatchBookmarkProgression || bookmarkLearned);

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
      <CelebrationModal open={showCelebrationModal} onClose={() => setShowCelebrationModal(false)} />

      {showConffetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} style={{ position: "fixed" }} />
      )}
      {isExerciseOver && isMatchExercise && isMatchBookmarkProgression && (
        <>
          <div className="next-nav-learning-cycle" style={{ textAlign: "left" }}>
            <img src={getStaticPath("icons", "zeeguu-icon-correct.png")} alt="Correct Icon" />
            <p>
              <b>
                {`${matchExerciseProgressionMessage}`} {celebrationMessageMatch()}
              </b>
            </p>
          </div>
        </>
      )}
      {!isMatchExercise && (
        <>
          {isCorrect && bookmarkLearned && (
            <CorrectMessage className={"next-nav-learning-cycle"} info={strings.wordLearned} />
          )}
        </>
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
                  onWordRemovedFromExercises={onWordRemovedFromExercises}
                />
              </s.EditSpeakButtonHolder>
            )}
            <s.FeedbackButton
              onClick={(e) => !isAutoPronouncing && moveToNextExercise()}
              autoFocus
              style={{
                backgroundColor: isAutoPronouncing ? "#f0f5f0" : undefined,
                color: isAutoPronouncing ? "#cccccc" : undefined,
                cursor: isAutoPronouncing ? "default" : "pointer",
              }}
            >
              {nextButtonText || strings.next}
            </s.FeedbackButton>
          </s.BottomRowSmallTopMargin>
          {!isMatchExercise && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
              <AutoPronounceToggle enabled={autoPronounceBookmark} onToggle={toggleAutoPronounceState} />
            </div>
          )}
        </>
      )}
      <SolutionFeedbackLinks
        exerciseBookmarks={exerciseBookmarks}
        prefixMsg={`Exercise URL: ${createShareableUrl()}`}
        handleShowSolution={handleShowSolution}
        toggleShow={toggleShow}
        isExerciseOver={isExerciseOver}
        bookmarkLearned={bookmarkLearned}
        shareableUrl={createShareableUrl()}
        exerciseType={exerciseType}
        disableAudio={disableAudio}
        setIsExerciseOver={setIsExerciseOver}
      />
      <FeedbackModal
        open={showFeedbackModal}
        setOpen={setShowFeedbackModal}
        componentCategories={FEEDBACK_OPTIONS.ALL}
        contextualInfo={{ url: createShareableUrl() }}
      />
    </>
  );
}
