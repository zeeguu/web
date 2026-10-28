import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
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

// A plain test of whether the learner knows a word, sprinkled into sessions
// now and then (see sprinkleRecallTests): one side of the word alone, type
// the other side. No context and no Hint button. Instead of typing they can
// say "I know it": the answer is shown and they say whether they were right.
// No ends it as Show solution does. The context is shown once it is over.
//
// RecallMeaning and RecallWord are its two directions.

export default function RecallTest({
  direction,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  notifyOfUserAttempt,
  notifyShowSolution,
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
  const { exerciseType, headlineKey, prompt, answer, isL1Answer, judgeAlternative } = direction;
  const [translatedWords, setTranslatedWords] = useState([]);
  const [saysTheyKnowIt, setSaysTheyKnowIt] = useState(false);

  useEffect(() => setSaysTheyKnowIt(false), [reload, exerciseBookmark]);

  // Another word or translation that fits as well, asked about.
  const { isChecking, note: answerNote, judge, clearNote } = useAnswerJudge(
    (typed, signal) => judgeAlternative(api, exerciseBookmark.id, typed, signal),
    isExerciseOver,
    [reload, exerciseBookmark],
  );

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType });

  // Loaded up front so the context can appear as soon as the answer is in.
  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType,
    reload,
    onExerciseLoaded,
  });

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="recallTest">
      <ExerciseInstructionHeader
        headline={strings[headlineKey]}
        l2Prompt={removePunctuation(prompt(exerciseBookmark))}
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

      {!isExerciseOver && saysTheyKnowIt && (
        <>
          <p className="wordInContextHeadline highlightedWord">{answer(exerciseBookmark)}</p>
          <div className="headlineWithMoreSpace">{strings.wereYouRight}</div>
          <s.BottomRow>
            <s.LeftFeedbackButton onClick={() => notifyShowSolution()}>{strings.no}</s.LeftFeedbackButton>
            <s.RightFeedbackButton onClick={() => notifyCorrectAnswer(exerciseBookmark)}>
              {strings.yes}
            </s.RightFeedbackButton>
          </s.BottomRow>
        </>
      )}

      {!isExerciseOver && !saysTheyKnowIt && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={() => notifyIncorrectAnswer(exerciseBookmark)}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
          isL1Answer={isL1Answer}
          onIKnowIt={() => setSaysTheyKnowIt(true)}
          judgeAnswer={judge}
          clearAnswerNote={clearNote}
          isChecking={isChecking}
        />
      )}
      <AnswerNote
        isChecking={isChecking}
        note={answerNote}
        expected={answer(exerciseBookmark)}
        isExerciseOver={isExerciseOver}
        isTranslation={isL1Answer}
      />
    </s.Exercise>
  );
}
