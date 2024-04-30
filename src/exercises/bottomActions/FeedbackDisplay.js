import * as s from "./FeedbackButtons.sc.js";
import { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import FeedbackButtons from "./FeedbackButtons.js";
import strings from "../../i18n/definitions.js";
import { EXERCISE_TYPES } from "../ExerciseTypeConstants.js";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function FeedbackDisplay({
  showFeedbackButtons,
  setShowFeedbackButtons,
  currentExerciseType,
  currentBookmarksToStudy,
  feedbackFunction,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userFeedback, setUserFeedback] = useState();

  useEffect(() => {
    if (currentExerciseType !== EXERCISE_TYPES.match) {
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
    setOpenSnackbar(false);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    feedbackFunction(userFeedback, selectedId);
    setUserFeedback(null);
    setOpenSnackbar(false);
  };

  return (
    <s.FeedbackHolder>
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
        autoHideDuration={1500}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {feedback}
          <s.UndoButton type="button" onClick={stopSendingModification}>
            {strings.undo}
          </s.UndoButton>
        </Alert>
      </Snackbar>
    </s.FeedbackHolder>
  );
}
