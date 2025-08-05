import { forwardRef, useImperativeHandle, useRef } from "react";
import BottomInput from "../exerciseTypes/BottomInput.js";

const AnimatedBottomInput = forwardRef(({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  handleExerciseCompleted,
  setIsCorrect,
  exerciseBookmark,
  notifyOfUserAttempt,
  onCorrectAnswerAnimationRequest,
  isAnimating,
  isL1Answer
}, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getInputElement: () => inputRef.current
  }));
  
  // Wrap the handleCorrectAnswer to trigger animation
  const handleCorrectAnswerWithAnimation = (bookmark) => {
    if (onCorrectAnswerAnimationRequest && inputRef.current) {
      // Get the actual input element from BottomInput
      const inputElement = inputRef.current.querySelector('input[type="text"]');
      if (inputElement) {
        onCorrectAnswerAnimationRequest(inputElement);
      } else {
        handleCorrectAnswer(bookmark);
      }
    } else {
      handleCorrectAnswer(bookmark);
    }
  };
  
  return (
    <div ref={inputRef}>
      <BottomInput
        handleCorrectAnswer={handleCorrectAnswerWithAnimation}
        handleIncorrectAnswer={handleIncorrectAnswer}
        handleExerciseCompleted={handleExerciseCompleted}
        setIsCorrect={setIsCorrect}
        exerciseBookmark={exerciseBookmark}
        notifyOfUserAttempt={notifyOfUserAttempt}
        isL1Answer={isL1Answer}
      />
    </div>
  );
});

AnimatedBottomInput.displayName = 'AnimatedBottomInput';

export default AnimatedBottomInput;