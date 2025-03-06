import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";
import { useState } from "react";

export default function MultipleChoiceAudioBottomInput({
  handleCorrectAnswer,
  handleIncorrectAnswer,
  messageToAPI,
  setMessageToAPI,
  currentChoice,
}) {
  const [isIncorrect, setIsIncorrect] = useState(false);

  function checkResult() {
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

  const OrangeButton = isIncorrect ? s.AnimatedOrangeButton : s.OrangeButton;

  return (
    <s.BottomRow>
      <>
        <OrangeButton
          onClick={checkResult}
          onAnimationEnd={() => setIsIncorrect(false)}
        >
          {strings.check}
        </OrangeButton>
      </>
    </s.BottomRow>
  );
}
