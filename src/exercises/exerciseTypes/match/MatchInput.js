import { useState } from "react";
import SpeakButton from "../SpeakButton";
import * as s from "../Exercise.sc";
import removePunctuation from "../../../assorted/removePunctuation";
import EditButton from "../../../words/EditButton.js";
import { zeeguuOrange, darkBlue, zeeguuRed, zeeguuViolet } from "../../../components/colors";

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
  reload,
  setReload,
}) {
  const answerColors = [
    {
      fontWeight: "700",
      color: `${zeeguuRed}`
    },
    {
      fontWeight: "700",
      color: `${darkBlue}`,
    },
    {
      fontWeight: "700",
      color: `${zeeguuViolet}`
    },
  ];

  const selectedButtonColor = {
    background: `${zeeguuOrange}`,
    color: "black",
    border: `0.15em solid ${zeeguuOrange}`,
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
  const match = "match";

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
                  {removePunctuation(option.from.toLowerCase())}
                </s.AnimatedMatchButton>
              ) : buttonsToDisable.includes(option.id) || isCorrect ? (
                <s.ButtonRow key={"L2_Row_" + option.id}>
                  <EditButton
                    bookmark={option}
                    api={api}
                    styling={match}
                    reload={reload}
                    setReload={setReload}
                  />
                  <s.MatchingWords
                    style={answerPairStyle(option.id)}
                    key={"L2_" + option.id}
                  >
                    {removePunctuation(option.from.toLowerCase())}
                  </s.MatchingWords>
                  <s.MatchSpeakButtonHolder>
                    <SpeakButton
                      bookmarkToStudy={option}
                      api={api}
                      styling={small}
                      key={"L2_Speak_" + option.id}
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
                  {removePunctuation(option.from.toLowerCase())}
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
                  {removePunctuation(option.to.toLowerCase())}
                </s.AnimatedMatchButton>
              ) : buttonsToDisable.includes(option.id) || isCorrect ? (
                <s.MatchingWords
                  style={answerPairStyle(option.id)}
                  key={"L1_" + option.id}
                >
                  {removePunctuation(option.to.toLowerCase())}
                </s.MatchingWords>
              ) : (
                <s.MatchButton
                  style={selectedButtonStyle("to", option.id)}
                  key={"L1_" + option.id}
                  id={option.id}
                  onClick={(e) => handleClick("to", Number(e.target.id))}
                >
                  {removePunctuation(option.to.toLowerCase())}
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
