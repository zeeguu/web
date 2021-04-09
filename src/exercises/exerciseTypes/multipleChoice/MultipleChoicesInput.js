import { useState, useEffect } from "react";

function MultipleChoicesInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
}) {
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  useEffect(() => {
    if (incorrectAnswer) {
      setIncorrectAnswers([...incorrectAnswers, incorrectAnswer]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifyChoiceSelection]);

  return (
    <div className="bottomInput">
      {buttonOptions ? (
        buttonOptions.map((option) => (
          <button
            key={option}
            id={option}
            onClick={(e) => notifyChoiceSelection(e.target.id)}
            disabled={incorrectAnswer && incorrectAnswers.includes(option)}
          >
            {option}
          </button>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default MultipleChoicesInput;
