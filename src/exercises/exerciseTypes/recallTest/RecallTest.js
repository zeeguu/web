import { useState, useEffect, useLayoutEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import BottomInput from "../BottomInput.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ExerciseLinksContext from "../../ExerciseLinksContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";
import { useAnswerJudge } from "../../utils/useAnswerJudge.js";
import AnswerNote from "../../components/AnswerNote.js";

// A plain test of whether the learner knows a word: one side of the word alone,
// no context and no Hint button. In typed mode (RecallMeaning / RecallWord),
// they type the other side or tap "I know it". In self-grade mode
// (FlashcardMeaning / FlashcardWord), they tap "Show answer" (or Space) and
// mark whether they knew it. The context appears once answered.

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
  const exerciseLinks = useContext(ExerciseLinksContext);
  const setLinksUnderInput = exerciseLinks?.setLinksUnderInput;
  const exerciseBookmark = bookmarksToStudy[0];
  const { exerciseType, headlineKey, prompt, answer, isL1Answer, judgeAlternative, selfGradeOnly = false } = direction;
  const [translatedWords, setTranslatedWords] = useState([]);
  const [saysTheyKnowIt, setSaysTheyKnowIt] = useState(false);

  useEffect(() => setSaysTheyKnowIt(false), [reload, exerciseBookmark]);

  // In self-grade flashcard mode, hide NextNavigation's duplicate "Show solution"
  // link while the card is still front-side up or awaiting Yes/No.
  useLayoutEffect(() => {
    if (!selfGradeOnly || !setLinksUnderInput) return;
    setLinksUnderInput(true);
    return () => setLinksUnderInput(false);
  }, [selfGradeOnly, setLinksUnderInput]);

  // Space reveals the answer on desktop in self-grade flashcard mode.
  useEffect(() => {
    if (!selfGradeOnly || isExerciseOver || saysTheyKnowIt) return;
    function handleKeyDown(e) {
      if (e.key !== " ") return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      e.preventDefault();
      setSaysTheyKnowIt(true);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selfGradeOnly, isExerciseOver, saysTheyKnowIt]);

  // Another word or translation that fits as well, asked about (typed mode only).
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

      {!isExerciseOver && !saysTheyKnowIt && selfGradeOnly && (
        <s.BottomRow>
          <s.RightFeedbackButton onClick={() => setSaysTheyKnowIt(true)}>Show answer</s.RightFeedbackButton>
        </s.BottomRow>
      )}

      {!isExerciseOver && !saysTheyKnowIt && !selfGradeOnly && (
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
      {!selfGradeOnly && (
        <AnswerNote
          isChecking={isChecking}
          note={answerNote}
          expected={answer(exerciseBookmark)}
          isExerciseOver={isExerciseOver}
          isTranslation={isL1Answer}
        />
      )}
    </s.Exercise>
  );
}
