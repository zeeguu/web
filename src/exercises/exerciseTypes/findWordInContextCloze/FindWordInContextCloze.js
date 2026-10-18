import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useCorrectionBeforeReveal } from "../../utils/useCorrectionBeforeReveal.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";
import { classifyTypedAnswer, EXACT, OTHER_WORD } from "../../utils/typedAnswer.js";
import { useAnswerJudge } from "../../utils/useAnswerJudge.js";
import AnswerNote from "../../components/AnswerNote.js";
import { ALTERNATIVE } from "../../ExerciseConstants.js";

// The user has to type the correct translation of a given L1 word in a L2 context. The L2 word is omitted in the context, so the user has to fill in the blank.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.findWordInContextCloze;

export default function FindWordInContextCloze({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  setIsCorrect,
  reload,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [correction, correctThenReveal] = useCorrectionBeforeReveal([reload, exerciseBookmark, isExerciseOver]);
  // Another word the learner typed ("tænker" for "synes"), asked about.
  const { isChecking, note: answerNote, judge } = useAnswerJudge(
    (typed, signal) => api.judgeClozeAlternative(exerciseBookmark.id, typed, signal),
    isExerciseOver,
    [reload, exerciseBookmark],
  );

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
  });

  useEffect(() => {
    setInputValue("");
    setIsCorrectAnswer(false);
  }, [reload, exerciseBookmark]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  function handleInputChange(value) {
    setInputValue(value);

    // Same test as on Enter, so typing and submitting never disagree.
    const isCorrect = classifyTypedAnswer(value, exerciseBookmark.from) === EXACT;
    setIsCorrectAnswer(isCorrect);

    // Delay auto-submit so the orange glow on the input lands before the
    // UI swaps to the exercise-over state.
    if (isCorrect && value.trim().length > 0) {
      setTimeout(() => {
        notifyCorrectAnswer(exerciseBookmark);
      }, 800);
    }
  }

  // notifyIncorrectAnswer records the "W". (This used to also hand the typed
  // text to notifyOfUserAttempt, which appends outcome codes, so the outcome
  // went to the API as e.g. "tænkerW".)
  function answerWasWrong(value) {
    correctThenReveal(value, () => notifyIncorrectAnswer(exerciseBookmark));
  }

  async function handleInputSubmit(value) {
    if (isChecking) return;
    const kind = classifyTypedAnswer(value, exerciseBookmark.from);
    if (kind === EXACT) {
      notifyCorrectAnswer(exerciseBookmark);
      return;
    }
    if (kind !== OTHER_WORD) {
      answerWasWrong(value);
      return;
    }

    // Another word: the prompt is a translation, and other words may fit it
    // ("thinks" -> synes, tænker, mener). Ask before calling it wrong.
    const verdict = await judge(value);
    if (!verdict) return; // the exercise ended or moved on meanwhile

    if (verdict.relation === "SYNONYM") {
      // On the shared-exercise page notifyCorrectAnswer ignores the outcome
      // and this simply counts as correct.
      notifyCorrectAnswer(exerciseBookmark, true, ALTERNATIVE);
    } else {
      answerWasWrong(value);
    }
  }

  return (
    <s.Exercise className="findWordInContextCloze">
      <ExerciseInstructionHeader
        headline={strings.findWordInContextClozeHeadline}
        l2Prompt={removePunctuation(exerciseBookmark.to)}
        isExerciseOver={isExerciseOver}
      />
      <s.ProgressBarReserve $visible={isExerciseOver}>
        {bookmarkProgressBar || <s.ProgressBarPlaceholder />}
      </s.ProgressBarReserve>
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={handleInputChange}
        onInputSubmit={handleInputSubmit}
        inputValue={inputValue}
        placeholder=""
        isCorrectAnswer={isCorrectAnswer}
        correction={correction}
        isChecking={isChecking}
        shouldFocus={true}
        canTypeInline={true}
      />
      <AnswerNote isChecking={isChecking} note={answerNote} expected={exerciseBookmark.from} />
    </s.Exercise>
  );
}
