import { useState, useEffect, useLayoutEffect, useContext, useRef } from "react";
import styled from "styled-components";
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
import { ALTERNATIVE } from "../../ExerciseConstants.js";
import { zeeguuWarmYellow } from "../../../components/colors.js";
import useBookmarkAutoPronounce from "../../../hooks/useBookmarkAutoPronounce.js";
import AutoPronounceToggle from "../../../components/AutoPronounceToggle.js";
import { pronounceBookmark } from "../../utils/pronounceBookmark.js";

// A plain test of whether the learner knows a word: one side of the word alone,
// no context and no Hint button. In typed mode (RecallMeaning / RecallWord),
// they type the other side or tap "I know it". In self-grade mode
// (FlashcardMeaning / FlashcardWord), they tap "Show answer" (or Space) and
// mark No / Kind of / Yes. The context appears once answered.

// The word (and, once revealed, its answer) centered in the space above;
// the grade buttons pinned to the bottom, where the thumb rests, so they
// stay put when the answer appears.
const CardStage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem 0;
`;

// The L2 prompt word: tapping it says it again.
const PromptWord = styled(s.FlashcardWord)`
  cursor: pointer;
`;

// The revealed answer: when it is the L2 word, tapping it says it again.
const AnswerWord = styled(s.FlashcardAnswer)`
  cursor: ${(props) => (props.$tappable ? "pointer" : "default")};
`;

const GradeBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  margin-top: 1.5rem;
  margin-bottom: 4.75rem;
`;

const GradePrompt = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const GradeRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 24rem;
`;

const GradeButton = styled.button`
  flex: 1;
  cursor: pointer;
  min-height: 3.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  user-select: none;
  transition: filter 0.15s ease;

  &:active {
    filter: brightness(0.95);
  }
`;

const NoButton = styled(GradeButton)`
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
`;

const KindOfButton = styled(GradeButton)`
  background-color: rgba(255, 187, 84, 0.22);
  color: var(--text-primary);
  border: 1px solid rgba(255, 187, 84, 0.65);
`;

const YesButton = styled(GradeButton)`
  background-color: ${zeeguuWarmYellow};
  color: var(--orange-btn-text);
  border: 1px solid transparent;
`;


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
  const [autoPronounce, , toggleAutoPronounce] = useBookmarkAutoPronounce();
  // When the answer is in L1, the prompt is the L2 word: saying it out loud
  // gives nothing away, so auto-pronounce speaks it as it appears.
  // When the answer is the L2 word, it is spoken as it is revealed.
  const promptIsL2 = isL1Answer;
  const l2WordShown = promptIsL2 || saysTheyKnowIt;
  const promptPronouncedFor = useRef(null);

  useEffect(() => setSaysTheyKnowIt(false), [reload, exerciseBookmark]);

  // In self-grade flashcard mode, hide NextNavigation's duplicate "Show solution"
  // link while the card is still front-side up or awaiting self-grade.
  useLayoutEffect(() => {
    if (!selfGradeOnly || !setLinksUnderInput) return;
    setLinksUnderInput(true);
    return () => setLinksUnderInput(false);
  }, [selfGradeOnly, setLinksUnderInput]);

  // Another word or translation that fits as well, asked about (typed mode only).
  const { isChecking, note: answerNote, judge, clearNote } = useAnswerJudge(
    (typed, signal) => judgeAlternative?.(api, exerciseBookmark.id, typed, signal),
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

  useEffect(() => {
    if (!promptIsL2 || !autoPronounce || !interactiveText || isExerciseOver) return;
    // Once per card (and per reload), not on every re-render.
    const cardKey = `${exerciseBookmark.id}:${reload}`;
    if (promptPronouncedFor.current === cardKey) return;
    promptPronouncedFor.current = cardKey;
    pronounceBookmark(interactiveText, speech, exerciseBookmark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptIsL2, autoPronounce, interactiveText, isExerciseOver, exerciseBookmark, reload]);

  // Pronounced from the reveal itself, not from an effect on saysTheyKnowIt:
  // that state still holds the previous card's value for one render when the
  // next card arrives, which would say the new answer before it is shown.
  function revealAnswer() {
    setSaysTheyKnowIt(true);
    if (!promptIsL2 && autoPronounce && interactiveText) {
      pronounceBookmark(interactiveText, speech, exerciseBookmark);
    }
  }

  // Space reveals the answer on desktop in self-grade flashcard mode.
  useEffect(() => {
    if (!selfGradeOnly || isExerciseOver || saysTheyKnowIt) return;
    function handleKeyDown(e) {
      if (e.key !== " ") return;
      const target = e.target;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "BUTTON" ||
        target?.isContentEditable ||
        target?.closest?.('[role="dialog"], [role="button"], a')
      ) {
        return;
      }
      e.preventDefault();
      revealAnswer();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfGradeOnly, isExerciseOver, saysTheyKnowIt]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  const pronounceWord = () => pronounceBookmark(interactiveText, speech, exerciseBookmark);
  const pronouncePrompt = promptIsL2 ? pronounceWord : undefined;
  const pronounceAnswer = promptIsL2 ? undefined : pronounceWord;
  // Shown where the auto-pronouncing happens: with the prompt when it is the
  // L2 word, otherwise only once the L2 answer is revealed.
  const cardPronounceToggle = (
    <AutoPronounceToggle enabled={autoPronounce} onToggle={toggleAutoPronounce} label="Auto-pronounce word" />
  );
  const promptPronounceToggle = promptIsL2 && cardPronounceToggle;

  const promptText = removePunctuation(prompt(exerciseBookmark));
  const useCenteredFlashcardLayout = !isExerciseOver && (selfGradeOnly || saysTheyKnowIt);

  return (
    <s.Exercise className="recallTest">
      {useCenteredFlashcardLayout ? (
        <CardStage className="flashcardStage">
          <s.FlashcardFace>
            <s.FlashcardHeadline>{strings[headlineKey]}</s.FlashcardHeadline>
            <PromptWord onClick={pronouncePrompt}>{promptText}</PromptWord>
            {saysTheyKnowIt && (
              <>
                <s.FlashcardDivider />
                <AnswerWord onClick={pronounceAnswer} $tappable={!!pronounceAnswer}>
                  {answer(exerciseBookmark)}
                </AnswerWord>
              </>
            )}
          </s.FlashcardFace>

          <GradeBlock>
            {saysTheyKnowIt ? (
              <>
                <GradePrompt>{strings.wereYouRight}</GradePrompt>
                <GradeRow>
                  <NoButton type="button" onClick={() => notifyShowSolution()}>
                    {strings.no}
                  </NoButton>
                  <KindOfButton
                    type="button"
                    onClick={() => notifyCorrectAnswer(exerciseBookmark, true, ALTERNATIVE)}
                  >
                    {strings.kindOf}
                  </KindOfButton>
                  <YesButton type="button" onClick={() => notifyCorrectAnswer(exerciseBookmark)}>
                    {strings.yes}
                  </YesButton>
                </GradeRow>
              </>
            ) : (
              <s.PrimaryExerciseButton type="button" onClick={revealAnswer}>
                {strings.showAnswer}
              </s.PrimaryExerciseButton>
            )}
            {l2WordShown && cardPronounceToggle}
          </GradeBlock>
        </CardStage>
      ) : (
        <>
          <ExerciseInstructionHeader
            headline={strings[headlineKey]}
            l2Prompt={promptText}
            isExerciseOver={isExerciseOver}
          />
          {!isExerciseOver && promptPronounceToggle}

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


          {!isExerciseOver && (
            <BottomInput
              handleCorrectAnswer={notifyCorrectAnswer}
              handleIncorrectAnswer={() => notifyIncorrectAnswer(exerciseBookmark)}
              handleExerciseCompleted={notifyExerciseCompleted}
              setIsCorrect={setIsCorrect}
              exerciseBookmark={exerciseBookmark}
              notifyOfUserAttempt={notifyOfUserAttempt}
              isL1Answer={isL1Answer}
              onIKnowIt={revealAnswer}
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
        </>
      )}
    </s.Exercise>
  );
}
