import { useState, useEffect, useContext, useRef } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import AnimatedBottomInput from "../../components/AnimatedBottomInput.js";

// The user has to type the correct translation of a given L1 word in a L2 context. The L2 word is omitted in the context, so the user has to fill in the blank.
// This tests the user's active knowledge.

const EXERCISE_TYPE = EXERCISE_TYPES.findWordInContextCloze;

export default function FindWordInContextCloze({
  bookmarksToStudy,
  notifyCorrectAnswer,
  notifyExerciseCompleted,
  notifyIncorrectAnswer,
  setExerciseType,
  isExerciseOver,
  setIsCorrect,
  notifyOfUserAttempt,
  reload,
  bookmarkProgressBar,
  onExampleUpdated,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [useInlineInput, setUseInlineInput] = useState(true); // Toggle between inline and bottom input
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const contextRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    setExerciseType(EXERCISE_TYPE);
    
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
    // eslint-disable-next-line
  }, [reload, exerciseBookmark]);

  if (!interactiveText) {
    return <LoadingAnimation />;
  }

  function handleIncorrectAnswer() {
    notifyIncorrectAnswer(exerciseBookmark);
  }

  function handleInputChange(value, inputElement) {
    setInputValue(value);
    
    // Constantly check if answer is correct
    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    const isCorrect = userInput === expectedAnswer;
    
    setIsCorrectAnswer(isCorrect);
    
    // Auto-submit when correct
    if (isCorrect && value.trim().length > 0) {
      setTimeout(() => {
        notifyCorrectAnswer(exerciseBookmark);
      }, 800); // Delay to show the orange glow
    }
  }

  function handleInputSubmit(value, inputElement) {
    const userInput = value.trim().toLowerCase();
    const expectedAnswer = removePunctuation(exerciseBookmark.from).toLowerCase();
    
    if (userInput === expectedAnswer) {
      notifyCorrectAnswer(exerciseBookmark);
    } else {
      // Check for close matches or provide feedback
      notifyOfUserAttempt(value, exerciseBookmark);
      handleIncorrectAnswer();
    }
  }

  return (
    <s.Exercise className="findWordInContextCloze">
      <div className="headlineWithMoreSpace" style={{ visibility: isExerciseOver ? 'hidden' : 'visible' }}>
        {strings.findWordInContextClozeHeadline}
      </div>
      <h1 className="wordInContextHeadline">{removePunctuation(exerciseBookmark.to)}</h1>
      <div style={{ visibility: isExerciseOver ? 'visible' : 'hidden', minHeight: '60px' }}>
        {bookmarkProgressBar || <div style={{ height: '60px', width: '30%', margin: '0.1em auto 0.5em auto' }}></div>}
      </div>
      {useInlineInput ? (
        <ClozeContextWithExchange
          ref={contextRef}
          exerciseBookmark={exerciseBookmark}
          interactiveText={interactiveText}
          translatedWords={null}
          setTranslatedWords={() => {}}
          isExerciseOver={isExerciseOver}
          onExampleUpdated={onExampleUpdated}
          onInputChange={handleInputChange}
          onInputSubmit={handleInputSubmit}
          inputValue={inputValue}
          placeholder=""
          isCorrectAnswer={isCorrectAnswer}
          shouldFocus={true}
        />
      ) : (
        <ContextWithExchange
          ref={contextRef}
          exerciseBookmark={exerciseBookmark}
          interactiveText={interactiveText}
          translatedWords={null}
          setTranslatedWords={() => {}}
          isExerciseOver={isExerciseOver}
          onExampleUpdated={onExampleUpdated}
        />
      )}

      {!isExerciseOver && !useInlineInput && (
        <>
          <AnimatedBottomInput
            handleCorrectAnswer={notifyCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            handleExerciseCompleted={notifyExerciseCompleted}
            setIsCorrect={setIsCorrect}
            exerciseBookmark={exerciseBookmark}
            notifyOfUserAttempt={notifyOfUserAttempt}
            ref={inputRef}
          />
        </>
      )}
    </s.Exercise>
  );
}
