import { useState, useRef, useEffect } from "react";
import * as s from "./TranslatableText.sc";

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
  clozeWord,
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

  const isOver = isCorrectAnswer || isExerciseOver;
  const currentValue = isExerciseOver && !isCorrectAnswer ? clozeWord : inputValue;

  // With monospace font, 1ch = 1 character, so width is simple
  // Minimum 8ch to accommodate "tap to type" hint and avoid jumping when typing starts
  const inputWidth = Math.max(currentValue.length + 1, 8);

  // Expose inputRef to parent for virtual keyboard
  useEffect(() => {
    if (onInputRef) onInputRef(inputRef);
  }, [onInputRef]);

  // Blur input when virtual keyboard is shown to hide native keyboard
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
    // Only hide hint when user actually has typed something
    if (e.target.value.length > 0) {
      setHintVisible(false);
    }

    let value = e.target.value;

    // Save cursor position before any modifications
    const cursorPosition = e.target.selectionStart;

    // Match capitalization of the solution
    if (clozeWord && value) {
      if (clozeWord.length > 0) {
        // If solution starts with uppercase, capitalize first letter
        if (clozeWord[0] === clozeWord[0].toUpperCase()) {
          value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        } else {
          // Otherwise make it lowercase
          value = value.toLowerCase();
        }

        // Update the input value to match our formatting
        e.target.value = value;

        // Restore cursor position after setting value
        e.target.setSelectionRange(cursorPosition, cursorPosition);
      }
    }

    if (onInputChange) {
      onInputChange(value, e.target);
    }
  }

  return (
    <s.ClozeWrapper
      key={wordId}
      $isOver={isOver}
      onClick={() => {
        if (!isOver && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      {canTypeInline ? (
        <s.ClozeInputWrapper>
          {showHint && hintVisible && inputValue === '' && !isExerciseOver && (
            <s.ClozeHint>tap to type</s.ClozeHint>
          )}
          <s.ClozeInput
            ref={inputRef}
            type="text"
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
      ) : (
        <s.ClozeStaticPlaceholder $isOver={isExerciseOver}>
          {isExerciseOver ? clozeWord : '\u00A0'}
        </s.ClozeStaticPlaceholder>
      )}
      {aboveClozeElement && !isExerciseOver && aboveClozeElement}
    </s.ClozeWrapper>
  );
}
