import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BottomInput from "../BottomInput.js";
import WordProgressBar from "../../progressBars/WordProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";

// The user has to translate the L2 word in bold to their L1.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.translateL2toL1;

export default function TranslateL2toL1({
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
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);
  const speech = useContext(SpeechContext);

  const exerciseBookmark = bookmarksToStudy[0];
  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Validate that context_tokenized exists and is properly formatted
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }

    const expectedPosition = {
      sentenceIndex: exerciseBookmark.t_sentence_i,
      tokenIndex: exerciseBookmark.t_token_i,
      totalTokens: exerciseBookmark.t_total_token || 1,
      contextOffset: exerciseBookmark.context_sent || 0
    };

    const adaptedBookmark = adaptExerciseBookmark(exerciseBookmark);

    setInteractiveText(
      new InteractiveExerciseText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
        null, // formatting
        exerciseBookmark.from, // expectedSolution
        expectedPosition, // expectedPosition
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="translateL2toL1">
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace" style={{ visibility: isExerciseOver ? 'hidden' : 'visible' }}>
        {strings.translateL2toL1Headline}
      </div>

      {/* Context - always at the top, never moves */}
      <ContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={translatedWords}
        setTranslatedWords={setTranslatedWords}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        highlightExpression={exerciseBookmark.from}
      />

      {/* Solution area - progress bar only; the L1 translation now
          surfaces as a chip above the highlighted word via bookmark
          restoration, so the big headline below is redundant. */}
      {isExerciseOver && bookmarkProgressBar && (
        <div style={{ marginTop: '3em' }}>
          {bookmarkProgressBar}
        </div>
      )}

      {/* Bottom input - only during exercise */}
      {!isExerciseOver && (
        <BottomInput
          handleCorrectAnswer={notifyCorrectAnswer}
          handleIncorrectAnswer={handleIncorrectAnswer}
          handleExerciseCompleted={notifyExerciseCompleted}
          setIsCorrect={setIsCorrect}
          exerciseBookmark={exerciseBookmark}
          notifyOfUserAttempt={notifyOfUserAttempt}
          isL1Answer={true}
        />
      )}
    </s.Exercise>
  );
}
