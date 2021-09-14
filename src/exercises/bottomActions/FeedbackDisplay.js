import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ImproveTranslationButtons from "./ImproveTranslationButtons.js";
import FeedbackButtons from "./FeedbackButtons.js";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FeedbackDisplay({
  showFeedbackButtons,
  setShowFeedbackButtons,
  showNewTranslationPrompt,
  setShowNewTranslationPrompt,
  currentExerciseType,
  currentBookmarksToStudy,
  adjustCurrentTranslation,
  feedbackFunction,
}) {
  const MATCH_EXERCISE_TYPE = "Match_three_L1W_to_three_L2W";

  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState();
  const [newTranslation, setNewTranslation] = useState();
  const [userFeedback, setUserFeedback] = useState();

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

  function stopSendingModification() {
    setUserFeedback(null);
    setNewTranslation(null);
    setOpenSnackbar(false);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    if (userFeedback) {
      feedbackFunction(userFeedback, selectedId);
      setUserFeedback(null);
    } else if (newTranslation) {
      adjustCurrentTranslation(currentBookmark, newTranslation);
      setNewTranslation(null);
    }
    setOpenSnackbar(false);
  };

  return (
    <s.FeedbackHolder>
      <ImproveTranslationButtons
        show={showNewTranslationPrompt}
        setShow={setShowNewTranslationPrompt}
        currentExerciseType={currentExerciseType}
        currentBookmarksToStudy={currentBookmarksToStudy}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setFeedback={setFeedback}
        setOpenSnackbar={setOpenSnackbar}
        setCurrentBookmark={setCurrentBookmark}
        setNewTranslation={setNewTranslation}
      />
      <FeedbackButtons
        show={showFeedbackButtons}
        setShow={setShowFeedbackButtons}
        currentExerciseType={currentExerciseType}
        currentBookmarksToStudy={currentBookmarksToStudy}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        setFeedback={setFeedback}
        setOpenSnackbar={setOpenSnackbar}
        setUserFeedback={setUserFeedback}
      />
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
