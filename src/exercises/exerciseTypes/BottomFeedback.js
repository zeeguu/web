import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import * as s from "./Exercise.sc";

export default function BottomFeedback({
  bookmarkToStudy,
  correctAnswer,
  api,
}) {
  return (
    <s.BottomRow>
      <SpeakButton bookmarkToStudy={bookmarkToStudy} api={api} />

      <s.FeedbackButton onClick={(e) => correctAnswer()} autoFocus>
        {strings.next}
      </s.FeedbackButton>
    </s.BottomRow>
  );
}
