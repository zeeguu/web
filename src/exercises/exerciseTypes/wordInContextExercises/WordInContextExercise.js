import { useContext } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import { useExerciseLifecycle } from "../../utils/useExerciseLifecycle.js";
import { useInteractiveTextForBookmark } from "../../utils/useInteractiveTextForBookmark.js";

//shared code for ClickWordInContext and FindWordInContext exercises
//The difference between the two is that in FindWordInContext the user can choose to either click on the word or type the word.

export default function WordInContextExercise({
  exerciseType,
  exerciseHeadline,
  showBottomInput,
  notifyExerciseCompleted,
  notifyShowSolution,
  reload,
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  setIsCorrect,
  resetSubSessionTimer,
  exerciseMessageToAPI,
  notifyOfUserAttempt,
  bookmarkProgressBar,
  onExampleUpdated,
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];

  useExerciseLifecycle({ speech, resetSubSessionTimer, setExerciseType, exerciseType });

  function onSolutionFound() {
    if (isExerciseOver) return;
    const translationCount = (exerciseMessageToAPI || "").split("").filter((c) => c === "T").length;
    if (translationCount < 1) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      notifyShowSolution();
    }
  }

  // Click-word exercises rely on TranslatableWord.clickOnWord routing the
  // user's tap to trackWordClick — which only happens when the word has no
  // pre-set translation. Pre-reveal we therefore skip the bookmark preload
  // (clicks work); post-reveal we re-mount the InteractiveText WITH the
  // adapted bookmark so bookmark restoration paints the bright-orange +
  // chip treatment. The `isExerciseOver` extra-dep drives the re-mount.
  const interactiveText = useInteractiveTextForBookmark({
    bookmark: exerciseBookmark,
    api,
    speech,
    exerciseType,
    reload,
    onExerciseLoaded,
    expectedSolution: exerciseBookmark.from,
    expectedPosition: {
      sentenceIndex: exerciseBookmark.t_sentence_i,
      tokenIndex: exerciseBookmark.t_token_i,
      totalTokens: exerciseBookmark.t_total_token || 1,
      contextOffset: exerciseBookmark.context_sent || 0,
    },
    onSolutionFound,
    preloadBookmark: isExerciseOver,
    extraDeps: [isExerciseOver],
  });

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className={exerciseType}>
      <ExerciseInstructionHeader
        headline={exerciseHeadline}
        l2Prompt={removePunctuation(exerciseBookmark.to)}
        isExerciseOver={isExerciseOver}
      />
      <div style={{ visibility: isExerciseOver ? "visible" : "hidden", minHeight: "60px" }}>
        {bookmarkProgressBar || <div style={{ height: "60px", width: "30%", margin: "0.1em auto 0.5em auto" }}></div>}
      </div>
      <ContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        highlightExpression={isExerciseOver ? exerciseBookmark.from : null}
      />
      {showBottomInput && !isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={() => notifyIncorrectAnswer(exerciseBookmark)}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
        />
      )}
    </s.Exercise>
  );
}
