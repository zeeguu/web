import { useContext, forwardRef } from "react";
import { ClozeTranslatableText } from "../../reader/ClozeTranslatableText.js";
import { APIContext } from "../../contexts/APIContext.js";
import ReplaceExampleModal from "../replaceExample/ReplaceExampleModal.js";

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
    shouldFocus,
    showHint = true,
    canTypeInline = false,
    showCloze = true, // New prop to control whether to show a cloze/blank
  },
  ref,
) {
  const api = useContext(APIContext);

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
          clozeWord={showCloze ? exerciseBookmark.from : null} // Only pass clozeWord if we want a blank
          nonTranslatableWords={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
          highlightExpression={highlightExpression}
          onInputChange={onInputChange}
          onInputSubmit={onInputSubmit}
          inputValue={inputValue}
          placeholder={placeholder}
          isCorrectAnswer={isCorrectAnswer}
          shouldFocus={shouldFocus}
          showHint={showHint}
          canTypeInline={canTypeInline}
        />
        {onExampleUpdated && isExerciseOver && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              marginTop: "0.1em",
              fontSize: "0.7em"
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
    </div>
  );
});

export default ClozeContextWithExchange;