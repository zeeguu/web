import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import * as s from "./Exercise.sc";

export default function BottomFeedback({
  bookmarkToStudy,
  correctAnswer,
  api,
}) {
  return (
    <div className="bottomInput">
      <SpeakButton bookmarkToStudy={bookmarkToStudy} api={api} />

      <s.NextButton onClick={(e) => correctAnswer()} autoFocus>
        {strings.next}
      </s.NextButton>
    </div>
  );
}
