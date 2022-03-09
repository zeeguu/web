import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";
import { useState } from "react";
import removeAccents from "remove-accents";

export default function AudioTwoBotInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  messageToAPI,
  setMessageToAPI,
  currentChoice,
}) {
 
  const [isIncorrect, setIsIncorrect] = useState(false);
 

  function checkResult() {
    console.log(currentChoice);
    console.log("checking result...");
    if (currentChoice === true) {
      let concatMessage = messageToAPI + "C";
      handleCorrectAnswer(concatMessage);
    } else {
      let concatMessage = messageToAPI + "W";
      setMessageToAPI(concatMessage);
      setIsIncorrect(true);
      handleIncorrectAnswer();
    }
  }

  

  return (
    <s.BottomRow>
      <>
        <s.RightFeedbackButton onClick={(checkResult)}>
          {strings.check}
        </s.RightFeedbackButton>
      </>
    </s.BottomRow>
  );
}
