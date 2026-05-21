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
    // Default to true so tapping the highlighted bookmark word
    // pronounces it — matches reading-view behavior and is what users
    // expect post-reveal.
    pronouncing = true,
    highlightExpression,
    translatedWords,
    setTranslatedWords,
  },
  ref,
) {
  // Compute word IDs for highlighting (both during and after exercise when highlightExpression is set)
  const clozeWordIds = useMemo(() => {
    if (!highlightExpression) return [];
    // Only highlight the actual bookmark word(s). Tokenizer-detected MWE
    // neighbors used to be pulled in via includeSeparatedMwe but they get
    // a different visual treatment than the bookmark word (which now
    // renders through bookmark-restoration), and the mismatch reads as a
    // bug — better to highlight just what the bookmark covers.
    return findClozeWordIds(interactiveText, exerciseBookmark);
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
