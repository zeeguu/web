import strings from "../../i18n/definitions";
import SpeakButton from "./SpeakButton";
import EditButton from "../../words/EditButton";
import * as s from "./Exercise.sc";

export default function NextNavigation({
  bookmarksToStudy,
  moveToNextExercise,
  api,
  reload,
  setReload,
}) {
  const bookmarkToStudy = bookmarksToStudy[0];

  const exercise = "exercise";

  return (
    <s.BottomRow className="bottomRow">
      {bookmarksToStudy.length === 1 && (
        <s.EditSpeakButtonHolder>
          <SpeakButton
            bookmarkToStudy={bookmarkToStudy}
            api={api}
            style="next"
          />
          <EditButton
            bookmark={bookmarksToStudy[0]}
            api={api}
            styling={exercise}
            reload={reload}
            setReload={setReload}
          />
        </s.EditSpeakButtonHolder>
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
