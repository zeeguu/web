import * as s from "../Exercise.sc";

function MultipleChoicesInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
}) {
  return (
    <s.BottomRow className="bottomRow">
      {buttonOptions ? (
        buttonOptions.map((option) =>
          incorrectAnswer === option ? (
            <s.AnimatedOrangeButton
              key={option}
              id={option}
              onClick={(e) => notifyChoiceSelection(e.target.id)}
              onAnimationEnd={() => setIncorrectAnswer("")}
            >
              {option}
            </s.AnimatedOrangeButton>
          ) : (
            <s.OrangeButton
              key={option}
              id={option}
              onClick={(e) => notifyChoiceSelection(e.target.id)}
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
