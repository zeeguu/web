import { useContext, useEffect, useState } from "react";
import * as s from "../Exercise.sc.js";
import BottomInput from "../BottomInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import { removePunctuation } from "../../../utils/text/preprocessing.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ExerciseInstructionHeader from "../../components/ExerciseInstructionHeader.js";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";

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
  isCorrect,
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
  const [interactiveText, setInteractiveText] = useState();
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(exerciseType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const onSolutionFound = () => {
      if (isExerciseOver) return;

      let translationCount = 0;
      if (exerciseMessageToAPI && exerciseMessageToAPI.length > 0) {
        for (let i = 0; i < exerciseMessageToAPI.length; i++) {
          if (exerciseMessageToAPI[i] === "T") translationCount++;
        }
      }

      if (translationCount < 1) {
        notifyCorrectAnswer(exerciseBookmark);
      } else {
        notifyShowSolution();
      }
    };

    const expectedPosition = {
      sentenceIndex: exerciseBookmark.t_sentence_i,
      tokenIndex: exerciseBookmark.t_token_i,
      totalTokens: exerciseBookmark.t_total_token || 1,
      contextOffset: exerciseBookmark.context_sent || 0,
    };

    // Click-word exercises rely on TranslatableWord.clickOnWord routing
    // the user's tap to trackWordClick — which only happens when the
    // word has NO pre-set translation. So:
    //   - Pre-reveal: don't pre-load the bookmark (clicks work).
    //   - Post-reveal: pre-load via the adapter so bookmark restoration
    //     paints the bright-orange + chip treatment.
    // Including isExerciseOver in the deps re-creates InteractiveText
    // on the reveal transition.
    const adaptedBookmark = isExerciseOver
      ? adaptExerciseBookmark(exerciseBookmark)
      : null;
    setInteractiveText(
      new InteractiveExerciseText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        exerciseType,
        speech,
        exerciseBookmark.context_identifier,
        null, // formatting
        exerciseBookmark.from, // expectedSolution
        expectedPosition,
        onSolutionFound,
      ),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload, isExerciseOver]);

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

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
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
        />
      )}
    </s.Exercise>
  );
}
