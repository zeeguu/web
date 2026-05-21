import { useMemo, useRef } from "react";
import { ClozeTranslatableText } from "./ClozeTranslatableText.js";
import { findClozeWordIds } from "../utils/findClozeWordIds.js";
import ContextNavigationControls from "./ContextNavigationControls.js";
import { useFlipOnReveal } from "../utils/useFlipOnReveal.js";

/**
 * Displays exercise context with word highlighting (no cloze input).
 * Used by exercises that don't need a cloze blank (e.g. click-word,
 * multiple-choice).
 */
export default function ContextWithExchange({
  exerciseBookmark,
  interactiveText,
  isExerciseOver,
  onExampleUpdated,
  translating = true,
  // Default true so tapping the highlighted bookmark word pronounces it
  // post-reveal — matches reading-view behavior.
  pronouncing = true,
  highlightExpression,
  translatedWords,
  setTranslatedWords,
}) {
  const contextRef = useRef(null);
  useFlipOnReveal(contextRef, isExerciseOver);

  // Highlight only what the bookmark covers. Tokenizer-detected MWE
  // neighbors used to be pulled in too, but they got a different visual
  // treatment than the bookmark word (which now renders via
  // bookmark-restoration) and the mismatch read as a bug.
  const clozeWordIds = useMemo(() => {
    if (!highlightExpression) return [];
    return findClozeWordIds(interactiveText, exerciseBookmark);
  }, [interactiveText, exerciseBookmark, highlightExpression]);

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
          />
        </div>
      </ContextNavigationControls>
    </div>
  );
}
