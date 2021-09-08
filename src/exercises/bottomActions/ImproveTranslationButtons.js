import * as s from "./FeedbackButtons.sc.js";
import { useEffect } from "react";
import strings from "../../i18n/definitions";

export default function ImproveTranslationButtons({
  show,
  setShow,
  currentExerciseType,
  currentBookmarksToStudy,
  selectedId,
  setSelectedId,
  setFeedback,
  setOpenSnackbar,
  setCurrentBookmark,
  setNewTranslation,
}) {
  const MATCH_EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

  useEffect(() => {
    if (show && selectedId) {
      adjustTranslationPrompt();
    }
  });

  function adjustTranslationPrompt() {
    let currentBookmarkArray = currentBookmarksToStudy.filter(
      (bookmark) => bookmark.id === selectedId
    );
    let bookmark = currentBookmarkArray[0];
    console.log(bookmark);
    let improvedTranslation = prompt(
      strings.submitTranslation +
        ": " +
        bookmark.from +
        "\n" +
        "(" +
        strings.currently +
        ": " +
        bookmark.to +
        ")"
    );
    if (improvedTranslation !== null && improvedTranslation !== "") {
      setCurrentBookmark(bookmark);
      setNewTranslation(improvedTranslation);
      setFeedback(
        `${strings.improveTranslationFeedback1} "${bookmark.from}" ${strings.improveTranslationFeedback2} "${improvedTranslation}"`
      );
      setOpenSnackbar(true);
    }
    if (currentExerciseType !== MATCH_EXERCISE_TYPE) {
      setShow(false);
    }
    if (currentExerciseType === MATCH_EXERCISE_TYPE) {
      setSelectedId(null);
    }
  }

  function handleSelection(event) {
    setSelectedId(Number(event.target.value));
  }

  return (
    <>
      {show && currentExerciseType === MATCH_EXERCISE_TYPE && (
        <>
          <s.FeedbackInstruction>{strings.clickWords}</s.FeedbackInstruction>{" "}
          <br />
          <s.FeedbackSelector>
            {currentBookmarksToStudy.map((bookmark) => (
              <s.FeedbackLabel key={bookmark.id}>
                <s.HiddenRadioButton
                  type="radio"
                  value={bookmark.id}
                  checked={Number(selectedId) === bookmark.id}
                  onChange={handleSelection}
                />
                {bookmark.from}
              </s.FeedbackLabel>
            ))}
          </s.FeedbackSelector>
        </>
      )}
    </>
  );
}
