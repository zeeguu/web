import * as s from "../Exercise.sc";

function MultipleChoicesInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
  isAnimating,
}) {
  return (
    <s.BottomRow className="bottomRow">
      {buttonOptions ? (
        buttonOptions.map((option) =>
          incorrectAnswer === option ? (
            <s.AnimatedOrangeButton
              key={option}
              id={option}
              onClick={(e) => !isAnimating && notifyChoiceSelection(e.target.id, e.currentTarget)}
              onAnimationEnd={() => setIncorrectAnswer("")}
              disabled={isAnimating}
              style={{ opacity: isAnimating ? 0.5 : 1 }}
            >
              {option}
            </s.AnimatedOrangeButton>
          ) : (
            <s.OrangeButton
              key={option}
              id={option}
              onClick={(e) => !isAnimating && notifyChoiceSelection(e.target.id, e.currentTarget)}
              disabled={isAnimating}
              style={{ opacity: isAnimating ? 0.5 : 1 }}
            >
              {option}
            </s.OrangeButton>
          ),
        )
      ) : (
        <></>
      )}
    </s.BottomRow>
  );
}

export default MultipleChoicesInput;
