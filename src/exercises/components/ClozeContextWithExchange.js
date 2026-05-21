import { useContext, useState, useRef, useMemo } from "react";
import { ClozeTranslatableText } from "./ClozeTranslatableText.js";
import ClozeInputField from "./ClozeInputField.js";
import ContextNavigationControls from "./ContextNavigationControls.js";
import { useFlipOnReveal } from "../utils/useFlipOnReveal.js";
import VirtualKeyboard from "../../components/VirtualKeyboard/VirtualKeyboard.js";
import SpecialCharacterBar, { hasSpecialCharacters } from "../../components/VirtualKeyboard/SpecialCharacterBar.js";
import { needsVirtualKeyboard } from "../../utils/misc/languageScripts.js";
import { UserContext } from "../../contexts/UserContext.js";
import { findClozeWordIds } from "../utils/findClozeWordIds.js";

/**
 * Orchestrates cloze exercises by combining:
 * - ClozeTranslatableText: renders text with a slot for the cloze input
 * - ClozeInputField: the actual input (provided via render prop)
 * - VirtualKeyboard/SpecialCharacterBar: language-specific input aids
 *
 * This component owns the cloze-specific props and passes them to
 * ClozeInputField via the renderClozeSlot render prop pattern.
 */

const getInitialKeyboardCollapsed = () => {
  try {
    const saved = localStorage.getItem('zeeguu_virtual_keyboard_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  } catch (e) {
    return false;
  }
};

export default function ClozeContextWithExchange({
  exerciseBookmark,
  interactiveText,
  translatedWords,
  setTranslatedWords,
  isExerciseOver,
  onExampleUpdated,
  translating = true,
  // Default true so tapping the highlighted cloze answer (or any
  // already-translated word) pronounces it — matches reading-view
  // behavior post-reveal.
  pronouncing = true,
  onInputChange,
  onInputSubmit,
  inputValue,
  placeholder,
  isCorrectAnswer,
  showHint = true,
  canTypeInline = false,
  showCloze = true,
  aboveClozeElement = null,
}) {
  const { userDetails } = useContext(UserContext);
  const [isKeyboardCollapsed, setIsKeyboardCollapsed] = useState(getInitialKeyboardCollapsed);
  const clozeInputRef = useRef(null);
  const contextRef = useRef(null);
  useFlipOnReveal(contextRef, isExerciseOver);

  const answerLanguageCode = exerciseBookmark?.from_lang;
  const showVirtualKeyboard =
    answerLanguageCode && needsVirtualKeyboard(answerLanguageCode, userDetails?.id) && canTypeInline && !isExerciseOver;
  const suppressOSKeyboard = showVirtualKeyboard && !isKeyboardCollapsed;

  const clozeWordIds = useMemo(() => {
    if (!showCloze) return [];
    return findClozeWordIds(interactiveText, exerciseBookmark);
  }, [interactiveText, exerciseBookmark, showCloze]);

  return (
    <div style={{ textAlign: "center" }}>
      <ContextNavigationControls
        exerciseBookmark={exerciseBookmark}
        onExampleUpdated={onExampleUpdated}
        isExerciseOver={isExerciseOver}
      >
        <div
          className="contextExample"
          style={{ display: "inline-block", position: "relative", textAlign: "left" }}
          ref={contextRef}
        >
          <ClozeTranslatableText
            isExerciseOver={isExerciseOver}
            interactiveText={interactiveText}
            translating={translating}
            pronouncing={pronouncing}
            translatedWords={translatedWords}
            setTranslatedWords={setTranslatedWords}
            clozeWordIds={clozeWordIds}
            nonTranslatableWords={exerciseBookmark.from}
            leftEllipsis={exerciseBookmark.left_ellipsis}
            rightEllipsis={exerciseBookmark.right_ellipsis}
            renderClozeSlot={(wordId) => (
              <ClozeInputField
                key={wordId}
                wordId={wordId}
                clozePhrase={exerciseBookmark.from}
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
        </div>
      </ContextNavigationControls>

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
}
