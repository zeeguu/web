import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { TranslatableText } from "../../../reader/TranslatableText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import BottomInput from "../BottomInput.js";
import WordProgressBar from "../../progressBars/WordProgressBar.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";
import ReplaceExampleModal from "../../replaceExample/ReplaceExampleModal.js";

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
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [translatedWords, setTranslatedWords] = useState([]);
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

    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
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
      <div className="contextExample">
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={true}
          pronouncing={false}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          bookmarkToStudy={exerciseBookmark.from}
          boldExpression={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
        />
      </div>

      {/* Solution area - appears below context when exercise is over */}
      {isExerciseOver && (
        <div style={{ marginTop: '3em' }}>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
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
