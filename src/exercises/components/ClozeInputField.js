import { useState, useRef, useEffect, useContext } from "react";
import * as s from "../../reader/TranslatableText.sc";
import { SpeechContext } from "../../contexts/SpeechContext.js";

/**
 * Self-contained cloze input field component.
 *
 * Owns all input-specific concerns:
 * - Hint visibility state ("tap to type")
 * - Auto-capitalization to match solution
 * - Ref management for virtual keyboard integration
 * - OS keyboard suppression when virtual keyboard is active
 *
 * This keeps ClozeTranslatableText focused on text rendering only.
 */
export default function ClozeInputField({
  wordId,
  clozePhrase,
  inputValue,
  placeholder = "",
  isExerciseOver = false,
  isCorrectAnswer = false,
  canTypeInline = false,
  showHint = true,
  aboveClozeElement = null,
  suppressOSKeyboard = false,
  onInputChange,
  onInputSubmit,
  onInputRef = null,
}) {
  const [hintVisible, setHintVisible] = useState(true);
  const inputRef = useRef(null);
  const speech = useContext(SpeechContext);

  const isOver = isCorrectAnswer || isExerciseOver;
  const currentValue = isExerciseOver && !isCorrectAnswer ? clozePhrase : inputValue;

  // Monospace font: 1ch = 1 character. Minimum 8ch fits the "tap to type"
  // hint without the input width jumping once the user starts typing.
  const inputWidth = Math.max(currentValue.length + 1, 8);

  useEffect(() => {
    if (onInputRef) onInputRef(inputRef);
  }, [onInputRef]);

  // Blur the input when the virtual keyboard is shown so the OS keyboard
  // doesn't fight with it for screen space on mobile.
  useEffect(() => {
    if (suppressOSKeyboard && inputRef.current) {
      inputRef.current.blur();
    }
  }, [suppressOSKeyboard]);

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onInputSubmit) {
        onInputSubmit(e.target.value, e.target);
      }
    }
  }

  function handleChange(e) {
    if (e.target.value.length > 0) {
      setHintVisible(false);
    }

    let value = e.target.value;
    const cursorPosition = e.target.selectionStart;

    // Force the input's casing to match the solution so a correct word
    // typed in the "wrong" case isn't marked wrong by upstream string
    // comparison.
    if (clozePhrase && value && clozePhrase.length > 0) {
      if (clozePhrase[0] === clozePhrase[0].toUpperCase()) {
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      } else {
        value = value.toLowerCase();
      }
      e.target.value = value;
      e.target.setSelectionRange(cursorPosition, cursorPosition);
    }

    if (onInputChange) {
      onInputChange(value, e.target);
    }
  }

  const handleWrapperClick = () => {
    if (isOver) {
      if (speech && clozePhrase) speech.speakOut(clozePhrase);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  let clozeBody;
  if (canTypeInline) {
    clozeBody = (
      <s.ClozeInputWrapper>
        {showHint && hintVisible && inputValue === '' && !isExerciseOver && (
          <s.ClozeHint>tap to type</s.ClozeHint>
        )}
        <s.ClozeInput
          ref={inputRef}
          type="text"
          inputMode={suppressOSKeyboard ? "none" : undefined}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          disabled={isOver}
          $isOver={isOver}
          $isCorrect={isCorrectAnswer}
          $isEmpty={inputValue === ''}
          $width={inputWidth}
          autoComplete="off"
          spellCheck="false"
        />
      </s.ClozeInputWrapper>
    );
  } else {
    clozeBody = (
      <s.ClozeStaticPlaceholder $isOver={isExerciseOver}>
        {isExerciseOver ? clozePhrase : '\u00A0'}
      </s.ClozeStaticPlaceholder>
    );
  }

  return (
    <s.ClozeWrapper key={wordId} $isOver={isOver} onClick={handleWrapperClick}>
      {clozeBody}
      {aboveClozeElement && !isExerciseOver && aboveClozeElement}
    </s.ClozeWrapper>
  );
}
