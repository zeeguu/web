import SelectionButton from "../../pages/_pages_shared/SelectionButton.sc";
import ButtonContainer from "../../components/modal_shared/ButtonContainer.sc";

export default function MatchBookmarkSelection({
  bookmarkSelected,
  exerciseBookmarks,
  setExerciseBookmarkForFeedback,
}) {
  return (
    <>
      <ButtonContainer style={{ flexWrap: "wrap", flexDirection: "row" }}>
        {exerciseBookmarks &&
          exerciseBookmarks.map((b) => (
            <SelectionButton
              className={bookmarkSelected && b.id === bookmarkSelected.id ? "selected" : ""}
              onClick={() => setExerciseBookmarkForFeedback(b)}
            >
              <div>
                {b.from}
                <br />
                <span style={{ color: "gray", fontSize: "smaller" }}>{b.to}</span>
              </div>
            </SelectionButton>
          ))}
      </ButtonContainer>
    </>
  );
}
