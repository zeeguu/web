import { useState, useEffect, useContext, useRef } from "react";
import * as s from "../Exercise.sc.js";
import MultipleChoicesInput from "./MultipleChoicesInput.js";
import LoadingAnimation from "../../../components/LoadingAnimation";
import InteractiveText from "../../../reader/InteractiveText.js";
import { EXERCISE_TYPES } from "../../ExerciseTypeConstants.js";
import strings from "../../../i18n/definitions.js";
import shuffle from "../../../assorted/fisherYatesShuffle";
import { removePunctuation } from "../../../utils/text/preprocessing";
import { SpeechContext } from "../../../contexts/SpeechContext.js";
import { APIContext } from "../../../contexts/APIContext.js";
import ContextWithExchange from "../../components/ContextWithExchange.js";
import FlyingWord from "../../components/FlyingWord.js";

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
  const [flyingWord, setFlyingWord] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const speech = useContext(SpeechContext);
  const exerciseBookmark = bookmarksToStudy[0];
  const contextRef = useRef(null);

  useEffect(() => {
    speech.stopAudio(); // Stop any pending speech from previous exercise
    resetSubSessionTimer();
    setExerciseType(EXERCISE_TYPE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.wordsSimilarTo(exerciseBookmark.id, (words) => {
      consolidateChoiceOptions(words);
    });
    
    // Validate that context_tokenized exists and is properly formatted
    if (!exerciseBookmark.context_tokenized || !Array.isArray(exerciseBookmark.context_tokenized)) {
      setInteractiveText(null);
      return;
    }
    
    const newInteractiveText = new InteractiveText(
      exerciseBookmark.context_tokenized,
      exerciseBookmark.source_id,
      api,
      [],
      "TRANSLATE WORDS IN EXERCISE",
      exerciseBookmark.from_lang,
      EXERCISE_TYPE,
      speech,
      exerciseBookmark.context_identifier,
    );
    
    setInteractiveText(newInteractiveText);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseBookmark, reload]);

  function notifyChoiceSelection(selectedChoice, buttonElement) {
    if (selectedChoice === removePunctuation(exerciseBookmark.from.toLowerCase())) {
      // Get button position
      const buttonRect = buttonElement.getBoundingClientRect();
      
      // Find the placeholder position - look for the dotted underline
      const placeholderElement = contextRef.current?.querySelector('span[style*="border-bottom"]') || 
                                contextRef.current?.querySelector('span[style*="borderBottom"]');
      
      if (placeholderElement) {
        const placeholderRect = placeholderElement.getBoundingClientRect();
        
        // Start flying animation
        setIsAnimating(true);
        setFlyingWord({
          word: selectedChoice,
          startRect: {
            left: buttonRect.left + buttonRect.width / 2 - 30,
            top: buttonRect.top + buttonRect.height / 2 - 15
          },
          endRect: {
            left: placeholderRect.left + placeholderRect.width / 2 - 30,
            top: placeholderRect.top + placeholderRect.height / 2 - 15
          }
        });
        
        // Delay the correct answer notification until animation completes
        setTimeout(() => {
          setIsCorrect(true);
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
            word: selectedChoice,
            startRect: {
              left: buttonRect.left + buttonRect.width / 2 - 30,
              top: buttonRect.top + buttonRect.height / 2 - 15
            },
            endRect: {
              left: contextRect.left + contextRect.width / 2 - 30,
              top: contextRect.top + contextRect.height / 2 - 15
            }
          });
          
          setTimeout(() => {
            setIsCorrect(true);
            notifyCorrectAnswer(exerciseBookmark);
            setIsAnimating(false);
            setFlyingWord(null);
          }, 800);
        } else {
          setIsCorrect(true);
          notifyCorrectAnswer(exerciseBookmark);
        }
      }
    } else {
      setIncorrectAnswer(selectedChoice);
      notifyIncorrectAnswer(exerciseBookmark);
      setIsCorrect(false);
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
      <ContextWithExchange
        ref={contextRef}
        exerciseBookmark={exerciseBookmark}
        interactiveText={interactiveText}
        translatedWords={[]}
        setTranslatedWords={() => {}}
        isExerciseOver={isExerciseOver}
        onExampleUpdated={onExampleUpdated}
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
          isAnimating={isAnimating}
        />
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
