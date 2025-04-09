import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";
import { useState } from "react";

export default function MultipleChoiceAudioBottomInput({
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  currentChoice,
  targetBookmark,
  bookmarksToStudy,
}) {
  const [isIncorrect, setIsIncorrect] = useState(false);

  function checkResult() {
    let bookmarkSelected = bookmarksToStudy[currentChoice];
    if (bookmarkSelected.id === targetBookmark.id) {
      notifyCorrectAnswer(targetBookmark);
    } else {
      notifyIncorrectAnswer(targetBookmark);
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
