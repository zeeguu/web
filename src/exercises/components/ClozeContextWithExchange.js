import { forwardRef, useContext, useState, useRef } from "react";
import { ClozeTranslatableText } from "../../reader/ClozeTranslatableText.js";
import ClozeInputField from "../../reader/ClozeInputField.js";
import ReplaceExampleModal from "../replaceExample/ReplaceExampleModal.js";
import VirtualKeyboard from "../../components/VirtualKeyboard/VirtualKeyboard.js";
import SpecialCharacterBar, { hasSpecialCharacters } from "../../components/VirtualKeyboard/SpecialCharacterBar.js";
import { needsVirtualKeyboard } from "../../utils/misc/languageScripts.js";
import { UserContext } from "../../contexts/UserContext.js";

// Check localStorage for keyboard collapsed state
const getInitialKeyboardCollapsed = () => {
  try {
    const saved = localStorage.getItem('zeeguu_virtual_keyboard_collapsed');
    return saved !== null ? JSON.parse(saved) : false; // Default to expanded (false)
  } catch (e) {
    return false;
  }
};

const ClozeContextWithExchange = forwardRef(function ClozeContextWithExchange(
  {
    exerciseBookmark,
    interactiveText,
    translatedWords,
    setTranslatedWords,
    isExerciseOver,
    onExampleUpdated,
    translating = true,
    pronouncing = false,
    highlightExpression,
    // cloze specific props
    onInputChange,
    onInputSubmit,
    inputValue,
    placeholder,
    isCorrectAnswer,
    showHint = true,
    canTypeInline = false,
    showCloze = true, // Control whether to show a cloze/blank
    aboveClozeElement = null, // Element to render above the cloze placeholder
  },
  ref,
) {
  const { userDetails } = useContext(UserContext);
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] = useState(getInitialKeyboardCollapsed);
  const clozeInputRef = useRef(null);

  // Determine the language for the answer (L2 for this exercise type)
  const answerLanguageCode = exerciseBookmark?.from_lang;
  const showVirtualKeyboard =
    answerLanguageCode && needsVirtualKeyboard(answerLanguageCode, userDetails?.id) && canTypeInline && !isExerciseOver;
  const suppressOSKeyboard = showVirtualKeyboard && !isKeyboardCollapsed;

  const clozeWord = showCloze ? exerciseBookmark.from : null;

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="contextExample"
        style={{ display: "inline-block", position: "relative", textAlign: "left" }}
        ref={ref}
      >
        <ClozeTranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
          translatedWords={translatedWords}
          setTranslatedWords={setTranslatedWords}
          clozeWord={clozeWord}
          nonTranslatableWords={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
          highlightExpression={highlightExpression}
          renderClozeSlot={(wordId) => (
            <ClozeInputField
              key={wordId}
              wordId={wordId}
              clozeWord={exerciseBookmark.from}
              inputValue={inputValue}
              placeholder={placeholder}
              isExerciseOver={isExerciseOver}
              isCorrectAnswer={isCorrectAnswer}
              canTypeInline={canTypeInline}
              showHint={showHint}
              aboveClozeElement={aboveClozeElement}
              suppressOSKeyboard={suppressOSKeyboard}
              onInputChange={onInputChange}
              onInputSubmit={onInputSubmit}
              onInputRef={(ref) => { clozeInputRef.current = ref; }}
            />
          )}
        />
        {onExampleUpdated && isExerciseOver && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              marginTop: "0.1em",
              fontSize: "0.7em",
            }}
          >
            <ReplaceExampleModal
              exerciseBookmark={exerciseBookmark}
              onExampleUpdated={onExampleUpdated}
              renderAs="link"
            />
          </div>
        )}
      </div>

      {/* Virtual Keyboard - shown below the context for non-Roman alphabets */}
      {showVirtualKeyboard && (
        <div style={{ marginTop: "1em" }}>
          <VirtualKeyboard
            languageCode={answerLanguageCode}
            onInput={onInputChange}
            currentValue={inputValue}
            initialCollapsed={false}
            onCollapsedChange={setIsKeyboardCollapsed}
            inputRef={clozeInputRef.current}
          />
        </div>
      )}

      {/* Special Character Bar - for Roman alphabets with special characters */}
      {!showVirtualKeyboard && canTypeInline && !isExerciseOver &&
       answerLanguageCode && hasSpecialCharacters(answerLanguageCode) && (
        <div style={{ marginTop: "1em" }}>
          <SpecialCharacterBar
            languageCode={answerLanguageCode}
            onKeyPress={onInputChange}
            currentValue={inputValue}
            inputRef={clozeInputRef.current}
          />
        </div>
      )}
    </div>
  );
});

export default ClozeContextWithExchange;
