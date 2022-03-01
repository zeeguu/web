import * as s from "../Exercise.sc";

function MultipleChoicesInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
}) {
  return (
    <s.BottomRow>
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
            <s.LeftFeedbackButton
              key={option}
              id={option}
              onClick={(e) => notifyChoiceSelection(e.target.id)}
            >
              {option}
            </s.LeftFeedbackButton>
          )
        )
      ) : (
        <></>
      )}
    </s.BottomRow>
  );
}

export default MultipleChoicesInput;
