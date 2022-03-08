import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";
import { useState } from "react";
import removeAccents from "remove-accents";

export default function MultipleChoicesInput({
  buttonOptions,
  notifyChoiceSelection,
  incorrectAnswer,
  setIncorrectAnswer,
  currentChoice,
  handleCorrectAnswer,
  handleIncorrectAnswer,
  bookmarksToStudy,
  messageToAPI,
  setMessageToAPI,
}) {
  const [currentInput, setCurrentInput] = useState("");
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [currentChoice, setCurrentChoice] = useState(null);

  
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

  function consoleAlert() {
    console.log("handle click");
  }

  return (
    <s.BottomRow>
      <>
        <s.RightFeedbackButton onClick={(checkResult, consoleAlert)}>
          {strings.check}
        </s.RightFeedbackButton>
      </>
    </s.BottomRow>
  );
}
