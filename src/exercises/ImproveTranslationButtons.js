import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import strings from "../i18n/definitions";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ImproveTranslationButtons({
  show,
  setShow,
  currentExerciseType,
  currentBookmarksToStudy,
  adjustCurrentTranslation,
}) {
  const MATCH_EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState();
  const [newTranslation, setNewTranslation] = useState();

  useEffect(() => {
    if (currentExerciseType !== MATCH_EXERCISE_TYPE) {
      setSelectedId(currentBookmarksToStudy[0].id);
    } else {
      setSelectedId(null);
    }
    console.log(selectedId);
    setOpenSnackbar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExerciseType]);

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

  function stopSendingModification() {
    setOpenSnackbar(false);
  }

  function handleSelection(event) {
    setSelectedId(Number(event.target.value));
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    adjustCurrentTranslation(currentBookmark, newTranslation);
    setOpenSnackbar(false);
  };

  return (
    <s.FeedbackHolder>
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
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={openSnackbar}
        autoHideDuration={4500}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {feedback}{" "}
          <s.UndoButton type="button" onClick={stopSendingModification}>
            UNDO
          </s.UndoButton>
        </Alert>
      </Snackbar>
    </s.FeedbackHolder>
  );
}
