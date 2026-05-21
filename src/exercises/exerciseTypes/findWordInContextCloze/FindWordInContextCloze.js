import { useState, useEffect, useContext, useRef } from "react";
import * as s from "../Exercise.sc.js";

import strings from "../../../i18n/definitions.js";
import LoadingAnimation from "../../../components/LoadingAnimation.js";
import InteractiveText from "../../../reader/InteractiveText.js";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { APIContext } from "../../../contexts/APIContext.js";
import ClozeContextWithExchange from "../../components/ClozeContextWithExchange.js";
import { adaptExerciseBookmark } from "../../utils/exerciseBookmarkAdapter.js";
import { useNotifyExerciseLoaded } from "../../utils/useNotifyExerciseLoaded.js";

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
  onExerciseLoaded,
}) {
  const api = useContext(APIContext);
  const [interactiveText, setInteractiveText] = useState();
  const [inputValue, setInputValue] = useState("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const contextRef = useRef(null);
  useNotifyExerciseLoaded(interactiveText, onExerciseLoaded);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    setExerciseType(EXERCISE_TYPE);

    // Reset input state when context changes
    setInputValue("");
    setIsCorrectAnswer(false);

    // Validate that context_tokenized exists and is properly formatted.
    // Skip the placeholder bookmark IndividualExercise renders before the
    // API call resolves — its context_tokenized is not [para][sent][token]
    // shape and t_sentence_i/t_token_i are undefined.
    const looksLikeValidContext =
      Array.isArray(exerciseBookmark.context_tokenized) &&
      Array.isArray(exerciseBookmark.context_tokenized[0]) &&
      Array.isArray(exerciseBookmark.context_tokenized[0][0]);
    if (!looksLikeValidContext || exerciseBookmark.t_sentence_i == null) {
      setInteractiveText(null);
      return;
    }

    const adaptedBookmark = adaptExerciseBookmark(exerciseBookmark);

    setInteractiveText(
      new InteractiveText(
        exerciseBookmark.context_tokenized,
        exerciseBookmark.source_id,
        api,
        adaptedBookmark ? [adaptedBookmark] : [],
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
      <h1
        className="wordInContextHeadline"
        style={{ visibility: isExerciseOver ? "hidden" : "visible" }}
      >
        {removePunctuation(exerciseBookmark.to)}
      </h1>
      <div style={{ visibility: isExerciseOver ? 'visible' : 'hidden', minHeight: '60px' }}>
        {bookmarkProgressBar || <div style={{ height: '60px', width: '30%', margin: '0.1em auto 0.5em auto' }}></div>}
      </div>
      <ClozeContextWithExchange
        ref={contextRef}
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        pronouncing={true}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
        onInputChange={handleInputChange}
        onInputSubmit={handleInputSubmit}
        inputValue={inputValue}
        placeholder=""
        isCorrectAnswer={isCorrectAnswer}
        shouldFocus={true}
        canTypeInline={true}
      />
    </s.Exercise>
  );
}
