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
    boldExpression,
    // cloze specific props
    onInputChange,
    onInputSubmit,
    inputValue,
    placeholder,
    isCorrectAnswer,
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
          bookmarkToStudy={exerciseBookmark.from}
          leftEllipsis={exerciseBookmark.left_ellipsis}
          rightEllipsis={exerciseBookmark.right_ellipsis}
          boldExpression={boldExpression}
          onInputChange={onInputChange}
          onInputSubmit={onInputSubmit}
          inputValue={inputValue}
          placeholder={placeholder}
          isCorrectAnswer={isCorrectAnswer}
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