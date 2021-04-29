import { useState } from "react";

function MatchInput({
  fromButtonOptions,
  toButtonOptions,
  notifyChoiceSelection,
  inputFirstClick,
  buttonsToDisable,
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
    <div className="matchInput">
      <div className="matchButtons">
        {fromButtonOptions ? (
          fromButtonOptions.map((option) => (
            <button
              style={buttonPairStyle("from", option.id)}
              className="matchButton"
              key={option.from}
              id={option.id}
              onClick={(e) => handleClick("from", Number(e.target.id))}
              disabled={buttonsToDisable.includes(option.id)}
            >
              {option.from}
            </button>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="matchButtons">
        {toButtonOptions ? (
          toButtonOptions.map((option) => (
            <button
              style={buttonPairStyle("to", option.id)}
              className="matchButton"
              key={option.to}
              id={option.id}
              onClick={(e) => handleClick("to", Number(e.target.id))}
              disabled={buttonsToDisable.includes(option.id)}
            >
              {option.to}
            </button>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default MatchInput;
