import { forwardRef, useMemo } from "react";
import { ClozeTranslatableText } from "./ClozeTranslatableText.js";
import { findClozeWordIds } from "../utils/findClozeWordIds.js";
import ContextNavigationControls from "./ContextNavigationControls.js";

/**
 * Displays exercise context with word highlighting (no cloze input).
 * Used by exercises that don't need a cloze blank (e.g., click-word, multiple-choice).
 *
 * Highlights the target expression when highlightExpression is provided.
 * Uses ClozeTranslatableText without renderClozeSlot for highlighting only.
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
      {/* Navigation controls wrap context for swipe support */}
      <ContextNavigationControls
        exerciseBookmark={exerciseBookmark}
        onExampleUpdated={onExampleUpdated}
        isExerciseOver={isExerciseOver}
      >
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
        </div>
      </ContextNavigationControls>
    </div>
  );
});

export default ContextWithExchange;
