import * as s from "../Exercise.sc";
import strings from "../../../i18n/definitions";

export default function MultipleChoiceAudioBottomInput({
  notifyCorrectAnswer,
  notifyIncorrectAnswer,
  currentChoice,
  targetBookmark,
  bookmarksToStudy,
}) {
  const bookmarkSelected = bookmarksToStudy[currentChoice];

  function checkResult() {
    if (bookmarkSelected.id === targetBookmark.id) {
      notifyCorrectAnswer(targetBookmark);
    } else {
      notifyIncorrectAnswer(targetBookmark);
    }
  }

  return (
    <s.BottomRow>
      <s.PickFirstCheckButton onClick={checkResult} disabled={!bookmarkSelected}>
        {strings.check}
      </s.PickFirstCheckButton>
    </s.BottomRow>
  );
}
