import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import * as s from "./Exercise.sc";

export default function NextNavigation({
  bookmarksToStudy,
  moveToNextExercise,
  api,
}) {
  const bookmarkToStudy = bookmarksToStudy[0];
  const next = "next";

  return (
    <s.BottomRow>
      {bookmarksToStudy.length === 1 && (
        <SpeakButton
          bookmarkToStudy={bookmarkToStudy}
          api={api}
          styling={next}
        />
      )}

      <s.FeedbackButton
        style={{
          width: "4em",
          height: "2.5em",
        }}
        onClick={(e) => moveToNextExercise()}
        autoFocus
      >
        {strings.next}
      </s.FeedbackButton>
    </s.BottomRow>
  );
}
