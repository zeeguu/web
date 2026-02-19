import * as s from "./TranslatableText.sc";

/**
 * Separate component for the cloze input field.
 * Keeps the input as a stable React element to maintain cursor position.
 */
export default function ClozeInputField({
  wordId,
  inputRef,
  inputValue,
  clozeWord,
  placeholder,
  isExerciseOver,
  isCorrectAnswer,
  canTypeInline,
  showHint,
  hintVisible,
  aboveClozeElement,
  onInputChange,
  onInputKeyPress,
}) {
  const isOver = isCorrectAnswer || isExerciseOver;
  const currentValue = isExerciseOver && !isCorrectAnswer ? clozeWord : inputValue;

  // With monospace font, 1ch = 1 character, so width is simple
  // Minimum 8ch to accommodate "tap to type" hint and avoid jumping when typing starts
  const inputWidth = Math.max(currentValue.length + 1, 8);

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
            onChange={onInputChange}
            onKeyPress={onInputKeyPress}
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
