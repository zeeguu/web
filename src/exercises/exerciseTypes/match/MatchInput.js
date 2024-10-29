import { useState } from "react";
import SpeakButton from "../SpeakButton";
import * as s from "../Exercise.sc";
import { removePunctuation } from "../../../utils/text/preprocessing";
import EditBookmarkButton from "../../../words/EditBookmarkButton.js";
import {
  zeeguuOrange,
  darkBlue,
  matchGreen,
  zeeguuViolet,
} from "../../../components/colors";

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
  onBookmarkSelected,
  notifyBookmarkDeletion,
  isPronouncing,
  lastCorrectBookmarkId,
}) {
  const answerColors = [
    {
      fontWeight: "700",
      color: `${matchGreen}`,
    },
    {
      fontWeight: "700",
      color: `${darkBlue}`,
    },
    {
      fontWeight: "700",
      color: `${zeeguuViolet}`,
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
    let selectedBookmark =
      column === "from"
        ? fromButtonOptions.find((option) => option.id === id)
        : toButtonOptions.find((option) => option.id === id);
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
    onBookmarkSelected(selectedBookmark);
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
      <s.MatchInputHolder className="matchInputHolder">
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
                  <EditBookmarkButton
                    bookmark={option}
                    api={api}
                    styling={match}
                    reload={reload}
                    setReload={setReload}
                    notifyDelete={() => notifyBookmarkDeletion(option)}
                  />
                  <s.MatchingWords
                    className="matchingWords"
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
                      parentIsSpeakingControl={
                        option.id === lastCorrectBookmarkId && isPronouncing
                      }
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
              ),
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
                  className="matchingWords"
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
              ),
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
