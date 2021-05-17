import { useState } from "react";
import removeAccents from "remove-accents";
import strings from "../../../i18n/definitions";
import * as s from "../Exercise.sc";

export default function BottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  handleHintUse,
  handleShowSolution,
  bookmarkToStudy,
  notifyKeyPress,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  function handleHint() {
    setUsedHint(true);
    let hint;
    if (
      currentInput === bookmarkToStudy.from.substring(0, currentInput.length)
    ) {
      hint = bookmarkToStudy.from.substring(0, currentInput.length + 1);
    } else {
      hint = bookmarkToStudy.from.substring(0, 1);
    }
    setCurrentInput(hint);
    handleHintUse("H");
  }

  function showSolution() {
    handleShowSolution();
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
    var b = removeQuotes(removeAccents(eliminateTypos(bookmarkToStudy.from)));
    if (a === b) {
      handleCorrectAnswer("C");
    } else {
      setIsIncorrect(true);
      handleIncorrectAnswer("W");
    }
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
    <>
      <s.BottomRow>
        <s.FeedbackButton onClick={(e) => handleHint()} disabled={usedHint}>
          {strings.hint}
        </s.FeedbackButton>

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

        <s.FeedbackButton onClick={checkResult}>
          {strings.check}
        </s.FeedbackButton>
      </s.BottomRow>
      <s.BottomRow>
        <s.OrangeButton onClick={showSolution}>
          {strings.showSolution}
        </s.OrangeButton>
      </s.BottomRow>
    </>
  );
}
