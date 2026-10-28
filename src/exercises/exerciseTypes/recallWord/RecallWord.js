import { useState, useContext } from "react";
import * as s from "../Exercise.sc.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import BottomInput from "../BottomInput.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";
import { useAnswerJudge } from "../../utils/useAnswerJudge.js";
import AnswerNote from "../../components/AnswerNote.js";

// The user sees only the L1 translation and has to type the L2 word: no
// context, no Hint button. A plain test of whether they know the word,
// sprinkled into sessions now and then (see sprinkleRecallTests).
// The context is shown once the exercise is over.

const EXERCISE_TYPE = EXERCISE_TYPES.recallWord;

export default function RecallWord({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  notifyOfUserAttempt,
  setExerciseType,
  reload,
  setIsCorrect,
  isExerciseOver,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const [translatedWords, setTranslatedWords] = useState([]);

  // Another word that means the same here ("tænker" for "synes"), asked about.
  const { isChecking, note: answerNote, judge, clearNote } = useAnswerJudge(
    (typed, signal) => api.judgeClozeAlternative(exerciseBookmark.id, typed, signal),
    isExerciseOver,
    [reload, exerciseBookmark],
  );

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType: EXERCISE_TYPE });

  // Loaded up front so the context can appear as soon as the answer is in.
  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType: EXERCISE_TYPE,
    reload,
    onExerciseLoaded,
  });

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="recallWord">
      <ExerciseInstructionHeader
        headline={strings.recallWordHeadline}
        l2Prompt={removePunctuation(exerciseBookmark.to)}
        isExerciseOver={isExerciseOver}
      />

      {isExerciseOver && (
        <ContextWithExchange
          exerciseBookmark={exerciseBookmark}
          interactiveText={interactiveText}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          isExerciseOver={isExerciseOver}
          onExampleUpdated={onExampleUpdated}
          highlightExpression={exerciseBookmark.from}
        />
      )}

      {isExerciseOver && bookmarkProgressBar && (
        <s.RevealedProgressBar>{bookmarkProgressBar}</s.RevealedProgressBar>
      )}

      {!isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={() => notifyIncorrectAnswer(exerciseBookmark)}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
          isL1Answer={false}
          showHint={false}
          judgeAnswer={judge}
          clearAnswerNote={clearNote}
          isChecking={isChecking}
        />
      )}
      <AnswerNote isChecking={isChecking} note={answerNote} expected={exerciseBookmark.from} />
    </s.Exercise>
  );
}
