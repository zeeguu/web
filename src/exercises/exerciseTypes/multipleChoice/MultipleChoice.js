import { useState, useEffect, useContext, useRef } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveExerciseText from "../../../reader/InteractiveExerciseText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";

// The user has to select the correct L2 translation of a given L1 word out of three.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.multipleChoice;

export default function MultipleChoice({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  setExerciseType,
  reload,
  isExerciseOver,
  setIsCorrect,
  resetSubSessionTimer,
  bookmarkProgressBar,
  onExampleUpdated,
}) {
  const api = useContext(APIContext);
  const [incorrectAnswer, setIncorrectAnswer] = useState("");
  const [buttonOptions, setButtonOptions] = useState(null);
  const [interactiveText, setInteractiveText] = useState();
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const contextRef = useRef(null);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);

    // Fetch similar words only once on mount - don't re-fetch on context change
    // to avoid giving away the answer
    api.wordsSimilarTo(exerciseBookmark.id, (words) => {
      consolidateChoiceOptions(words);
    });
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
    
    const newInteractiveText = new InteractiveExerciseText(
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
    );
    
    setInteractiveText(newInteractiveText);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  function notifyChoiceSelection(selectedChoice) {
    if (selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())) {
      setIsCorrect(true);
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      setIsCorrect(false);
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
    }
  }

  function consolidateChoiceOptions(similarWords) {
    let firstRandomInt = Math.floor(Math.random() * similarWords.length);
    let secondRandomInt;
    do {
      secondRandomInt = Math.floor(Math.random() * similarWords.length);
    } while (firstRandomInt === secondRandomInt);
    let listOfOptions = [
      removePunctuation(exerciseBookmark.from.toLowerCase()),
      removePunctuation(similarWords[firstRandomInt].toLowerCase()),
      removePunctuation(similarWords[secondRandomInt].toLowerCase()),
    ];
    let shuffledListOfOptions = shuffle(listOfOptions);
    setButtonOptions(shuffledListOfOptions);
  }

  if (!interactiveText || !buttonOptions) {
    return <LoadingAnimation />;
  }

  return (
    <s.Exercise className="multipleChoice">
      {/* Instructions - visible during exercise, invisible when showing solution but still take space */}
      <div className="headlineWithMoreSpace" style={{ visibility: isExerciseOver ? 'hidden' : 'visible' }}>
        {strings.chooseTheWordFittingContextHeadline}
      </div>

      {/* Context - always at the top, never moves */}
      <ClozeContextWithExchange
        ref={contextRef}
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={(data) => {
          onExampleUpdated(data);
          // Force refresh of interactive text when example is updated
          const expectedPosition = {
            sentenceIndex: data.updatedBookmark.context_sent || 0,
            startToken: data.updatedBookmark.t_start_token || 0,
            endToken: data.updatedBookmark.t_end_token || 1,
            totalTokens: data.updatedBookmark.t_total_token || 1,
            contextOffset: data.updatedBookmark.context_sent || 0
          };
          
          const newInteractiveText = new InteractiveExerciseText(
            data.updatedBookmark.context_tokenized,
            data.updatedBookmark.source_id,
            api,
            [],
            "TRANSLATE WORDS IN EXERCISE",
            data.updatedBookmark.from_lang,
            EXERCISE_TYPE,
            speech,
            data.updatedBookmark.context_identifier,
            null, // formatting
            data.updatedBookmark.from, // expectedSolution
            expectedPosition, // expectedPosition
            null, // onSolutionFound - not needed for multiple choice
          );
          
          setInteractiveText(newInteractiveText);
        }}
        onInputChange={() => {}} // No input handling needed for multiple choice
        onInputSubmit={() => {}} // No input handling needed for multiple choice
        inputValue={isExerciseOver ? exerciseBookmark.from : ""}
        placeholder=""
        isCorrectAnswer={isExerciseOver}
        shouldFocus={false} // Don't focus the hidden input
        showHint={false} // Don't show "tap to type" hint
        canTypeInline={false}
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
