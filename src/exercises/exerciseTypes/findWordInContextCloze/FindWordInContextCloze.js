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
import FlyingWord from "../../components/FlyingWord.js";
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
  const [flyingWord, setFlyingWord] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
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
  
  function handleCorrectAnswerWithAnimation(inputElement) {
    // Get input position
    const inputRect = inputElement.getBoundingClientRect();
    
    // Find the placeholder position
    const placeholderElement = contextRef.current?.querySelector('span[style*="border-bottom"]') || 
                              contextRef.current?.querySelector('span[style*="borderBottom"]');
    
    if (placeholderElement) {
      const placeholderRect = placeholderElement.getBoundingClientRect();
      
      // Start flying animation
      setIsAnimating(true);
      setFlyingWord({
        word: inputElement.value,
        startRect: {
          left: inputRect.left + inputRect.width / 2 - 30,
          top: inputRect.top + inputRect.height / 2 - 15
        },
        endRect: {
          left: placeholderRect.left + placeholderRect.width / 2 - 30,
          top: placeholderRect.top + placeholderRect.height / 2 - 15
        }
      });
      
      // Delay the correct answer notification until animation completes
      setTimeout(() => {
        notifyCorrectAnswer(exerciseBookmark);
        setIsAnimating(false);
        setFlyingWord(null);
      }, 800);
    } else {
      // Fallback - animate to approximate position if placeholder not found
      const contextRect = contextRef.current?.getBoundingClientRect();
      
      if (contextRect) {
        setIsAnimating(true);
        setFlyingWord({
          word: inputElement.value,
          startRect: {
            left: inputRect.left + inputRect.width / 2 - 30,
            top: inputRect.top + inputRect.height / 2 - 15
          },
          endRect: {
            left: contextRect.left + contextRect.width / 2 - 30,
            top: contextRect.top + contextRect.height / 2 - 15
          }
        });
        
        setTimeout(() => {
          notifyCorrectAnswer(exerciseBookmark);
          setIsAnimating(false);
          setFlyingWord(null);
        }, 800);
      } else {
        notifyCorrectAnswer(exerciseBookmark);
      }
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
      <ContextWithExchange
        ref={contextRef}
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={null}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
      />

      {!isExerciseOver && (
        <>
          <AnimatedBottomInput
            handleCorrectAnswer={notifyCorrectAnswer}
            handleIncorrectAnswer={handleIncorrectAnswer}
            handleExerciseCompleted={notifyExerciseCompleted}
            setIsCorrect={setIsCorrect}
            exerciseBookmark={exerciseBookmark}
            notifyOfUserAttempt={notifyOfUserAttempt}
            ref={inputRef}
            onCorrectAnswerAnimationRequest={handleCorrectAnswerWithAnimation}
            isAnimating={isAnimating}
          />
        </>
      )}
      
      {/* Flying word animation */}
      {flyingWord && (
        <FlyingWord
          word={flyingWord.word}
          startRect={flyingWord.startRect}
          endRect={flyingWord.endRect}
          onAnimationComplete={() => {}}
        />
      )}
    </s.Exercise>
  );
}
