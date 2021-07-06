import { useState } from "react";
import SpeakButton from "../SpeakButton";
import * as s from "../Exercise.sc";

function MatchInput({
  fromButtonOptions,
  toButtonOptions,
  notifyChoiceSelection,
  inputFirstClick,
  buttonsToDisable,
  isCorrect,
  api,
  incorrectAnswer,
  setIncorrectAnswer,
}) {
  const answerColors = [
    {
      fontWeight: "700",
      color: "#00665C",
    },
    {
      fontWeight: "700",
      color: "#1770B3",
    },
    {
      fontWeight: "700",
      color: "#B34F20",
    },
  ];

  const selectedButtonColor = {
    background: "#ffd04799",
    color: "black",
    border: "0.15em solid #ffbb54",
  };

  const [firstSelection, setFirstSelection] = useState(0);
  const [firstSelectionColumn, setFirstSelectionColumn] = useState("");

  function handleClick(column, id) {
    if (firstSelection !== 0) {
      if (
        (column === "from" && firstSelectionColumn === "from") ||
        (column === "to" && firstSelectionColumn === "to")
      ) {
        inputFirstClick();
        setFirstSelection(id);
      } else {
        if (firstSelectionColumn === "from") {
          notifyChoiceSelection(firstSelection, id);
        } else {
          notifyChoiceSelection(id, firstSelection);
        }
        setFirstSelection(0);
      }
    } else {
      inputFirstClick();
      setFirstSelection(id);
      if (column === "from") {
        setFirstSelectionColumn("from");
      } else {
        setFirstSelectionColumn("to");
      }
    }
  }

  const answerPairStyle = (id) => {
    for (let i = 0; i < fromButtonOptions.length; i++) {
      if (id === fromButtonOptions[i].id) return answerColors[i];
    }
  };

  const selectedButtonStyle = (column, id) => {
    if (firstSelectionColumn === column && firstSelection === id) {
      return selectedButtonColor;
    }
    return null;
  };

  const small = "small";

  return (
    <>
      <s.MatchInputHolder>
        <s.MatchButtonHolder>
          {fromButtonOptions ? (
            fromButtonOptions.map((option) =>
              Number(incorrectAnswer) === option.id &&
              firstSelectionColumn !== "from" ? (
                <s.AnimatedMatchButton
                  key={"L2_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("from", Number(e.target.id))}
                  onAnimationEnd={() => setIncorrectAnswer("")}
                >
                  {option.from}
                </s.AnimatedMatchButton>
              ) : buttonsToDisable.includes(option.id) || isCorrect ? (
                <s.ButtonRow>
                  <p style={answerPairStyle(option.id)} key={"L2_" + option.id}>
                    {option.from}
                  </p>
                  <s.MatchSpeakButtonHolder>
                    <SpeakButton
                      bookmarkToStudy={option}
                      api={api}
                      styling={small}
                    />
                  </s.MatchSpeakButtonHolder>
                </s.ButtonRow>
              ) : (
                <s.MatchButton
                  style={selectedButtonStyle("from", option.id)}
                  key={"L2_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("from", Number(e.target.id))}
                >
                  {option.from}
                </s.MatchButton>
              )
            )
          ) : (
            <></>
          )}
        </s.MatchButtonHolder>
        <s.MatchButtonHolderRight>
          {toButtonOptions ? (
            toButtonOptions.map((option) =>
              Number(incorrectAnswer) === option.id &&
              firstSelectionColumn !== "to" ? (
                <s.AnimatedMatchButton
                  key={"L1_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("to", Number(e.target.id))}
                  onAnimationEnd={() => setIncorrectAnswer("")}
                >
                  {option.to}
                </s.AnimatedMatchButton>
              ) : buttonsToDisable.includes(option.id) || isCorrect ? (
                <s.MatchingWords
                  style={answerPairStyle(option.id)}
                  key={"L1_" + option.id}
                >
                  {option.to}
                </s.MatchingWords>
              ) : (
                <s.MatchButton
                  style={selectedButtonStyle("to", option.id)}
                  key={"L1_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("to", Number(e.target.id))}
                >
                  {option.to}
                </s.MatchButton>
              )
            )
          ) : (
            <></>
          )}
        </s.MatchButtonHolderRight>
      </s.MatchInputHolder>
    </>
  );
}

export default MatchInput;
