import { forwardRef, useMemo } from "react";
import { ClozeTranslatableText } from "./ClozeTranslatableText.js";
import { findClozeWordIds } from "../utils/findClozeWordIds.js";
import ReplaceExampleModal from "../replaceExample/ReplaceExampleModal.js";

/**
 * Displays exercise context with optional word highlighting.
 * Used by exercises that don't need a cloze blank (e.g., click-word, multiple-choice).
 *
 * Uses ClozeTranslatableText with empty clozeWordIds to get exercise features
 * (nonTranslatableWords, highlighting) without showing a blank.
 */
const ContextWithExchange = forwardRef(function ContextWithExchange(
  {
    exerciseBookmark,
    interactiveText,
    isExerciseOver,
    onExampleUpdated,
    translating = true,
    pronouncing = false,
    highlightExpression,
    translatedWords,
    setTranslatedWords,
  },
  ref,
) {
  // Compute word IDs for highlighting (both during and after exercise when highlightExpression is set)
  const clozeWordIds = useMemo(() => {
    if (!highlightExpression) return [];
    // Use includeSeparatedMwe for highlighting so all MWE parts are highlighted
    return findClozeWordIds(interactiveText, exerciseBookmark, { includeSeparatedMwe: true });
  }, [interactiveText, exerciseBookmark, highlightExpression]);

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
          clozeWordIds={clozeWordIds}
          nonTranslatableWords={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
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

export default ContextWithExchange;
