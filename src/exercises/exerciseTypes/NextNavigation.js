import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import * as s from "./Exercise.sc";

export default function NextNavigation({
  bookmarkToStudy,
  moveToNextExercise,
  api,
}) {
  function isIterable(obj) {
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === "function";
  }

  return (
    <s.BottomRow>
      {!isIterable(bookmarkToStudy) && (
        <SpeakButton bookmarkToStudy={bookmarkToStudy} api={api} />
      )}

      <s.FeedbackButton onClick={(e) => moveToNextExercise()} autoFocus>
        {strings.next}
      </s.FeedbackButton>
    </s.BottomRow>
  );
}
