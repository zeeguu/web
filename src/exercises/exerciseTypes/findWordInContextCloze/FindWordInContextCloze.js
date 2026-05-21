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
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";

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

  function handleInputSubmit(value) {
    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    if (userInput === expectedAnswer) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      notifyOfUserAttempt(value, exerciseBookmark);
      notifyIncorrectAnswer(exerciseBookmark);
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
        shouldFocus={true}
        canTypeInline={true}
      />
    </s.Exercise>
  );
}
