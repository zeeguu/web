import { useEffect, useState } from "react";
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
  const [distanceToCorrect, setDistanceToCorrect] = useState(0);
  const [isSameLengthAsSolution, setIsSameLengthAsSolution] = useState(false);
  const [isLongerThanSolution, setIsLongerThanSolution] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const levenshtein = require("fast-levenshtein");

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

  // Update the feedback message
  useEffect(() => {
    if (distanceToCorrect < 5 && distanceToCorrect > 2) {
      setFeedbackMessage("❌ Not quite the word!");
      return;
    }
    if (distanceToCorrect === 2) {
      setFeedbackMessage("⭐ You are almost there!");
      return;
    }
    if (distanceToCorrect === 1) {
      if (isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to change 1 letter!");
        return;
      }
      if (isLongerThanSolution) {
        setFeedbackMessage("⭐ You need to remove 1 letter!");
        return;
      }
      if (!isLongerThanSolution && !isSameLengthAsSolution) {
        setFeedbackMessage("⭐ You need to add 1 letter!");
        return;
      }
    }
    setFeedbackMessage("");
    return;
  }, [distanceToCorrect, isSameLengthAsSolution, isLongerThanSolution]);

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
      let levDistance = levenshtein.get(a, b);
      setIsLongerThanSolution(a.length > b.length);
      setIsSameLengthAsSolution(a.length === b.length);
      console.log("You are this far: " + levDistance);
      setDistanceToCorrect(levDistance);
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
        <div>
          <div className="type-feedback">
            {feedbackMessage !== "" && <p>{feedbackMessage}</p>}
          </div>
          <InputField
            type="text"
            className={
              distanceToCorrect >= 3 && distanceToCorrect > 0
                ? "wrong-border"
                : "almost-border"
            }
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
        </div>
        <s.RightFeedbackButton onClick={checkResult}>
          {strings.check}
        </s.RightFeedbackButton>
      </s.BottomRow>
    </>
  );
}
