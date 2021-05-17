import { useState } from "react";
import removeAccents from "remove-accents";
import strings from "../../../i18n/definitions";
import * as s from "../Exercise.sc";

export default function BottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  handleHintUse,
  bookmarkToStudy,
  notifyKeyPress,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [attemptCounter, setAttemptCounter] = useState(0);

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
    let attempt = attemptCounter + 1;
    setAttemptCounter(attempt);
    handleHintUse("H");
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
    let attempt = attemptCounter + 1;
    if (a === b) {
      handleCorrectAnswer("C");
    } else {
      setIsIncorrect(true);
      handleIncorrectAnswer("W");
    }
    setAttemptCounter(attempt);
  }

  const InputField = isIncorrect ? s.AnimatedInput : s.Input;
  return (
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

      <s.FeedbackButton onClick={checkResult}>{strings.check}</s.FeedbackButton>
    </s.BottomRow>
  );
}
