import { useState, useEffect } from "react";
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
  isIncorrect,
  setIsIncorrect,
  isMatch,
  setIsMatch,
}) {
  const buttonColors = [
    {
      background: "#ffbb54",
      color: "white",
      border: "0.125em solid #ffbb54",
    },
    {
      background: "#ffd047",
      color: "white",
      border: "0.125em solid #ffd047",
    },
    {
      background: "#ffd04740",
      color: "black",
      border: "0.125em solid #ffd04740",
    },
    {
      background: "#ffd04799",
      color: "black",
      border: "0.125em solid #ffbb54",
    },
  ];

  const [firstSelection, setFirstSelection] = useState(0);
  const [firstSelectionColumn, setFirstSelectionColumn] = useState("");

  useEffect(() => {
    if (isMatch) {
      setFirstSelection(0);
      setIsMatch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMatch]);

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

  function endAnimation() {
    setFirstSelection(0);
    setIsIncorrect(false);
  }

  const buttonPairStyle = (column, id) => {
    if (firstSelectionColumn === column && firstSelection === id) {
      return buttonColors[3];
    } else {
      for (let i = 0; i < buttonsToDisable.length; i++) {
        if (id === buttonsToDisable[i]) return buttonColors[i];
      }
    }
  };

  return (
    <s.MatchInputHolder>
      <s.MatchButtonHolder>
        {fromButtonOptions ? (
          fromButtonOptions.map((option) =>
            isIncorrect &&
            firstSelection === option.id &&
            firstSelectionColumn === "from" ? (
              <s.AnimatedMatchButton
                key={"L2_" + option.id}
                id={option.id}
                onClick={(e) => handleClick("from", Number(e.target.id))}
                onAnimationEnd={() => endAnimation()}
              >
                {option.from}
              </s.AnimatedMatchButton>
            ) : (
              <s.MatchButton
                style={buttonPairStyle("from", option.id)}
                key={"L2_" + option.id}
                id={option.id}
                onClick={(e) => handleClick("from", Number(e.target.id))}
                disabled={buttonsToDisable.includes(option.id)}
              >
                {option.from}
              </s.MatchButton>
            )
          )
        ) : (
          <></>
        )}
      </s.MatchButtonHolder>
      {isCorrect && (
        <s.MatchButtonHolder>
          {fromButtonOptions.map((option) => (
            <s.MatchSpeakButtonHolder>
              <SpeakButton bookmarkToStudy={option} api={api} />
            </s.MatchSpeakButtonHolder>
          ))}
        </s.MatchButtonHolder>
      )}
      <s.MatchButtonHolder>
        {toButtonOptions ? (
          toButtonOptions.map((option) =>
            isIncorrect &&
            firstSelection === option.id &&
            firstSelectionColumn === "to" ? (
              <s.AnimatedMatchButton
                key={"L1_" + option.id}
                id={option.id}
                onClick={(e) => handleClick("to", Number(e.target.id))}
                onAnimationEnd={() => endAnimation()}
              >
                {option.to}
              </s.AnimatedMatchButton>
            ) : (
              <s.MatchButton
                style={buttonPairStyle("to", option.id)}
                key={"L1_" + option.id}
                id={option.id}
                onClick={(e) => handleClick("to", Number(e.target.id))}
                disabled={buttonsToDisable.includes(option.id)}
              >
                {option.to}
              </s.MatchButton>
            )
          )
        ) : (
          <></>
        )}
      </s.MatchButtonHolder>
    </s.MatchInputHolder>
  );
}

export default MatchInput;
