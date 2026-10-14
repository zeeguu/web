import { useState, useEffect, useContext, useRef } from "react";
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

// The user has to type the correct translation of a given L1 word in a L2 context. The L2 word is omitted in the context, so the user has to fill in the blank.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.findWordInContextCloze;

export default function FindWordInContextCloze({
  bookmarksToStudy,
  notifyCorrectAnswer,
  // Absent outside an exercise session (the shared-exercise page): an
  // accepted alternative then counts as correct there.
  notifyAlternativeAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  setIsCorrect,
  notifyOfUserAttempt,
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
  // While the API judges another word the learner typed ("tænker" for "synes").
  const [isChecking, setIsChecking] = useState(false);
  // What the API said about it, kept under the sentence after the reveal.
  const [answerNote, setAnswerNote] = useState(null);
  const currentBookmarkId = useRef(exerciseBookmark?.id);
  currentBookmarkId.current = exerciseBookmark?.id;

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
    setIsChecking(false);
    setAnswerNote(null);
  }, [reload, exerciseBookmark]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  function handleInputChange(value) {
    setInputValue(value);

    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    const isCorrect = userInput === expectedAnswer;
    setIsCorrectAnswer(isCorrect);

    // Delay auto-submit so the orange glow on the input lands before the
    // UI swaps to the exercise-over state.
    if (isCorrect && value.trim().length > 0) {
      setTimeout(() => {
        notifyCorrectAnswer(exerciseBookmark);
      }, 800);
    }
  }

  function answerWasWrong(value) {
    notifyOfUserAttempt(value, exerciseBookmark);
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
    const bookmarkId = exerciseBookmark.id;
    setIsChecking(true);
    const verdict = await api.judgeClozeAlternative(bookmarkId, value);
    if (currentBookmarkId.current !== bookmarkId) return; // moved on meanwhile
    setIsChecking(false);

    if (verdict.relation === "SYNONYM") {
      setAnswerNote({ kind: "alternative" });
      (notifyAlternativeAnswer || notifyCorrectAnswer)(exerciseBookmark);
    } else if (verdict.relation === "NEAR_SYNONYM_NOT_IDIOMATIC") {
      setAnswerNote({ kind: "nearMiss", explanation: verdict.explanation });
      answerWasWrong(value);
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

function AnswerNote({ isChecking, note, expected }) {
  if (isChecking) return <s.AnswerNote>{strings.checkingAnswer}</s.AnswerNote>;
  if (!note) return null;

  const lead = note.kind === "alternative" ? strings.alsoRightPractising : strings.understoodButPractising;
  return (
    <s.AnswerNote>
      {lead} <strong>{removePunctuation(expected)}</strong>.
      {note.explanation && <> {note.explanation}</>}
    </s.AnswerNote>
  );
}
