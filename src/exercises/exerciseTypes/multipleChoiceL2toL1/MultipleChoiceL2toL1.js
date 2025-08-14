import { useState, useEffect, useContext } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "../multipleChoice/MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";

import { APIContext } from "../../../contexts/APIContext.js";
import { TRANSLATE_WORD } from "../../ExerciseConstants.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";

// The user has to select the correct L1 translation out of three. The L2 word is marked in bold in the context.
// This tests the user's passive knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoiceL2toL1;

export default function MultipleChoiceL2toL1({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  notifyOfUserAttempt,
  reload,
  setIsCorrect,
  isExerciseOver,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
}) {
  const api = useContext(APIContext);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [interactiveText, setInteractiveText] = useState();
  const [prevTranslatedWords, setPrevTranslatedWords] = useState(0);
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
    if (translatedWords.length > prevTranslatedWords) {
      setPrevTranslatedWords(translatedWords.length);
      notifyOfUserAttempt(TRANSLATE_WORD, exerciseBookmark);
    }
  }, [translatedWords]);

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

    console.log("=== MultipleChoiceL2toL1 DEBUG ===");
    console.log("Exercise bookmark:", exerciseBookmark);
    console.log("Word to highlight:", exerciseBookmark.from);
    console.log("Expected position:", expectedPosition);

    setInteractiveText(
      new InteractiveExerciseText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        [],
        "TRANSLATE WORDS IN EXERCISE",
        exerciseBookmark.from_lang,
        EXERCISE_TYPE,
        speech,
        exerciseBookmark.context_identifier,
        null, // formatting
        exerciseBookmark.from, // expectedSolution
        expectedPosition, // expectedPosition
        null, // onSolutionFound - not needed for multiple choice
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  useEffect(() => {
    if (interactiveText) {
      setButtonOptions(
        shuffle([
          removePunctuation(bookmarksToStudy[0].to),
          removePunctuation(bookmarksToStudy[1].to),
          removePunctuation(bookmarksToStudy[2].to),
        ]),
      );
    }
    // eslint-disable-next-line
  }, [interactiveText]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.to)) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
    }
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace">
        {strings.multipleChoiceL2toL1Headline}
      </div>

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={translatedWords}
        setTranslatedWords={setTranslatedWords}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        translating={true}
        pronouncing={false}
        highlightExpression={exerciseBookmark.from}
        onInputChange={() => {}} // No input handling needed for multiple choice
        onInputSubmit={() => {}} // No input handling needed for multiple choice
        inputValue=""
        placeholder=""
        isCorrectAnswer={false}
        shouldFocus={false}
        showHint={false}
        canTypeInline={false}
        showCloze={false} // Don't show a blank, show highlighting instead
      />

      {/* Solution area - appears below context when exercise is over */}
      {isExerciseOver && (
        <div style={{ marginTop: '3em' }}>
          <h1 className="wordInContextHeadline">
            {removePunctuation(exerciseBookmark.to)}
          </h1>
          {bookmarkProgressBar}
        </div>
      )}

      {/* Multiple choice buttons - only during exercise */}
      {!buttonOptions && <LoadingAnimation />}
      {!isExerciseOver && (
        <MultipleChoicesInput
          buttonOptions={buttonOptions}
          notifyChoiceSelection={notifyChoiceSelection}
          incorrectAnswer={incorrectAnswer}
          setIncorrectAnswer={setIncorrectAnswer}
        />
      )}
    </s.Exercise>
  );
}
