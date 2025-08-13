import { useContext, forwardRef } from "react";
import { TranslatableText } from "../../reader/TranslatableText.js";
import { APIContext } from "../../contexts/APIContext.js";
import ReplaceExampleModal from "../replaceExample/ReplaceExampleModal.js";

const ContextWithExchange = forwardRef(function ContextWithExchange(
  {
    exerciseBookmark,
    interactiveText,
    isExerciseOver,
    onExampleUpdated,
    translating = true,
    pronouncing = false,
    highlightExpression,
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
        <TranslatableText
          isExerciseOver={isExerciseOver}
          interactiveText={interactiveText}
          translating={translating}
          pronouncing={pronouncing}
          nonTranslatableWords={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
          highlightExpression={highlightExpression}
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
