import { useState } from "react";
import removeAccents from "remove-accents";
import strings from "../../../i18n/definitions";
import * as s from "../Exercise.sc";

export default function BottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  bookmarksToStudy,
  notifyKeyPress,
  messageToAPI,
  setMessageToAPI,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  function handleHint() {
    setUsedHint(true);
    let hint;
    if (
      currentInput ===
      bookmarksToStudy[0].from.substring(0, currentInput.length)
    ) {
      hint = bookmarksToStudy[0].from.substring(0, currentInput.length + 1);
    } else {
      hint = bookmarksToStudy[0].from.substring(0, 1);
    }
    setCurrentInput(hint);
    let concatMessage = messageToAPI + "H";
    setMessageToAPI(concatMessage);
  }

  function eliminateTypos(x) {
    return x.trim().toUpperCase();
    // .replace(/[^a-zA-Z ]/g, '')
  }

  function removeQuotes(x) {
    return x.replace(/[^a-zA-Z ]/g, "");
  }

  function checkResult() {
    if (currentInput === "") {
      return;
    }
    console.log("checking result...");
    var a = removeQuotes(removeAccents(eliminateTypos(currentInput)));
    var b = removeQuotes(
      removeAccents(eliminateTypos(bookmarksToStudy[0].from))
    );
    if (a === b) {
      let concatMessage = messageToAPI + "C";
      handleCorrectAnswer(concatMessage);
    } else {
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
      setIsIncorrect(true);
      handleIncorrectAnswer();
    }
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
    <>
      <s.BottomRow className="bottomRow">
        <s.LeftFeedbackButton onClick={(e) => handleHint()} disabled={usedHint}>
          {strings.hint}
        </s.LeftFeedbackButton>

        <InputField
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyUp={(e) => {
            if (currentInput !== "") {
              notifyKeyPress();
            }
            if (e.key === "Enter") {
              checkResult();
            }
          }}
          onAnimationEnd={() => setIsIncorrect(false)}
          autoFocus
        />
        <s.RightFeedbackButton onClick={checkResult}>
          {strings.check}
        </s.RightFeedbackButton>
      </s.BottomRow>
    </>
  );
}
