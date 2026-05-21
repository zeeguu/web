import strings from "../../i18n/definitions";
import * as s from "./Exercise.sc";
import SolutionFeedbackLinks from "./SolutionFeedbackLinks";
import { getExerciseTypeName } from "../exerciseTypes/exerciseTypeNames";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import SessionStorage from "../../assorted/SessionStorage.js";
import { SpeechContext } from "../../contexts/SpeechContext.js";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants";
import { WEB_URL } from "../../config";

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
  onReportClick,
  isReported,
  interactiveText,
}) {
  const messageForAPI = isEmptyDictionary(bookmarkMessagesToAPI) ? "" : bookmarkMessagesToAPI[exerciseBookmark.id];
  const api = useContext(APIContext);
  const [userIsCorrect] = correctnessBasedOnTries(messageForAPI);
  const [learningCycle, setLearningCycle] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [autoPronounceBookmark, autoPronounceString, toggleAutoPronounceState] = useBookmarkAutoPronounce();
  const speech = useContext(SpeechContext);
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

  // Find the linked word for this exercise's bookmark so we can route
  // auto-pronounce through interactiveText.pronounce — same path
  // TranslatableWord.clickOnWord uses, which means SPEAK_TEXT activity
  // logging and MWE-partner pronunciation come for free. Without this
  // auto-pronounce would say "rigole" while a manual tap says "il
  // rigole" — inconsistent with the chip.
  function findBookmarkWord() {
    if (!interactiveText?.paragraphsAsLinkedWordLists) return null;
    for (const par of interactiveText.paragraphsAsLinkedWordLists) {
      for (let w = par.linkedWords.head; w; w = w.next) {
        if (w.bookmark_id === exerciseBookmark.id) return w;
      }
    }
    return null;
  }

  function computeMweTextToSpeak(word) {
    if (!word?.token?.mwe_group_id || !word.findMWEPartners) return null;
    const partners = word.findMWEPartners();
    if (partners.length <= 1) return null;
    return partners.reduce((acc, p, i) => {
      if (i === 0) return p.word;
      if (partners[i - 1].word.endsWith("-")) return acc + p.word;
      return acc + " " + p.word;
    }, "");
  }

  function handleSpeak() {
    setIsAutoPronouncing(true);
    const word = findBookmarkWord();
    if (word) {
      interactiveText.pronounce(word, null, computeMweTextToSpeak(word));
    } else {
      speech.speakOut(exerciseBookmark.from);
    }
    // Delay re-enabling the Next button so a quick Enter-press during
    // auto-pronounce can't double-skip past the spoken solution.
    setTimeout(() => setIsAutoPronouncing(false), 500);
  }

  useEffect(() => {
    // Auto-pronounce the correct word after exercise completion when enabled
    if (isExerciseOver && autoPronounceBookmark && !isMatchExercise) handleSpeak();

    // eslint-disable-next-line
  }, [isExerciseOver]);

  // Allow pressing Enter to continue to next exercise when exercise is over
  useEffect(() => {
    if (!isExerciseOver) return;

    const handleKeyDown = (e) => {
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter' && !isAutoPronouncing) {
        e.preventDefault();
        moveToNextExercise();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExerciseOver, isAutoPronouncing, moveToNextExercise]);

  useEffect(() => {
    if (bookmarkLearned && !SessionStorage.isCelebrationModalShown()) {
      setShowCelebrationModal(true);
      SessionStorage.setCelebrationModalShown(true);
    }
  }, [bookmarkLearned]);
  const isExerciseCorrect = (isCorrect && !isMatchExercise) || isCorrectMatch;

  // Use WEB_URL instead of window.location.origin to avoid capacitor://localhost in mobile apps
  const createShareableUrl = () => {
    const exerciseTypeName = getExerciseTypeName(exerciseType);

    if (EXERCISE_TYPES.isMultiBookmarkExercise(exerciseType) && exerciseBookmarks && exerciseBookmarks.length > 1) {
      const bookmarkIds = exerciseBookmarks.map((b) => b.id).join(",");
      return `${WEB_URL}/exercise/${exerciseTypeName}/${bookmarkIds}`;
    }

    if (!exerciseBookmark) return "";
    return `${WEB_URL}/exercise/${exerciseTypeName}/${exerciseBookmark.id}`;
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
          {/* Speaker button removed — tap-to-pronounce on the highlighted
              bookmark word (via reading-view's TranslatableWord handler)
              covers the same need without a dedicated button. Next sits
              alone here so the BottomRow's space-around centers it. */}
          <s.BottomRowSmallTopMargin className="bottomRow">
            <s.FeedbackButton
              className="next-btn"
              onClick={(e) => !isAutoPronouncing && moveToNextExercise()}
              autoFocus
              style={{
                opacity: isAutoPronouncing ? 0.4 : undefined,
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
        exerciseBookmark={exerciseBookmark}
        handleShowSolution={handleShowSolution}
        isExerciseOver={isExerciseOver}
        shareableUrl={createShareableUrl()}
        exerciseType={exerciseType}
        disableAudio={disableAudio}
        setIsExerciseOver={setIsExerciseOver}
        onWordRemovedFromExercises={onWordRemovedFromExercises}
        onReportClick={onReportClick}
        isReported={isReported}
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
