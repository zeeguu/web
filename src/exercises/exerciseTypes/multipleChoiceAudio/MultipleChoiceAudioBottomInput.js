import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";
import { useState } from "react";

export default function MultipleChoiceAudioBottomInput({
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  currentChoice,
  bookmarksToStudy,
}) {
  const [isIncorrect, setIsIncorrect] = useState(false);

  function checkResult() {
    console.log(currentChoice);
    let bookmarkSelected = bookmarksToStudy[currentChoice];
    if (currentChoice === true) {
      notifyCorrectAnswer(bookmarkSelected);
    } else {
      notifyIncorrectAnswer(bookmarkSelected);
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
