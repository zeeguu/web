import Button from "../../pages/_pages_shared/Button.sc";
import ButtonContainer from "../../components/modal_shared/ButtonContainer.sc";

export default function MatchBookmarkSelection({
  bookmarkSelected,
  exerciseBookmarks,
  setExerciseBookmarkForFeedback,
}) {
  return (
    <>
      <p>Which word would you like to remove?</p>
      <ButtonContainer style={{ flexWrap: "wrap", flexDirection: "row" }}>
        {exerciseBookmarks &&
          exerciseBookmarks.map((b) => (
            <Button
              className={
                b === bookmarkSelected
                  ? "small-border-btn blue-btn"
                  : "small-border-btn blue-outline-btn"
              }
              onClick={() => setExerciseBookmarkForFeedback(b)}
            >
              {b.from}
            </Button>
          ))}
      </ButtonContainer>
    </>
  );
}
