import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext, useState } from "react";
import Chip from "@mui/material/Chip";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import { gray, darkBlue } from "../components/colors";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { APIContext } from "../contexts/APIContext";

export default function ReportBroken({ articleID, sourceID, UMR_SOURCE }) {
  const api = useContext(APIContext);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setIsFeedbackSent(false);
    setError(null);
  };

  const handleClose = () => {
    setFeedback("");
    setOpen(false);
    setError(null);
    setReportInfo(null);
  };

  function reportBroken() {
    setIsSubmitting(true);
    setError(null);

    // Call new API endpoint
    api.reportBrokenArticle(
      articleID,
      feedback,
      (response) => {
        setIsSubmitting(false);
        if (response.status === "success") {
          setIsFeedbackSent(true);
          setReportInfo(response);

          // Also log for analytics
          api.logUserActivity(api.USER_FEEDBACK, articleID, feedback, UMR_SOURCE, sourceID);

          setTimeout(() => handleClose(), 2000);
        } else {
          setError("Failed to submit report. Please try again.");
        }
      },
      (error) => {
        setIsSubmitting(false);
        setError("Network error. Please check your connection and try again.");
      }
    );
  }

  const handleChange = (e) => {
    setFeedback(e.target.value);
    setIsFeedbackSent(false);
  };

  return (
    <>
      <div style={{ marginLeft: "5px" }}>
        <Chip
          label="Report broken article"
          component="a"
          onClick={handleClickOpen}
          variant="outlined"
          clickable
          color="warning"
          size="small"
          icon={<ReportProblemRoundedIcon />}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <b>Report broken article</b>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDisplay: "row",
            paddingTop: "0px",
            minWidth: "14em",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {isFeedbackSent && reportInfo ? (
            <Alert severity="success">
              <div>
                <strong>Thank you for your report!</strong>
                {reportInfo.marked_as_broken ? (
                  <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
                    This article has been marked as broken and won't be shown to other users.
                    {reportInfo.is_teacher && (
                      <div style={{ marginTop: "8px", fontStyle: "italic" }}>
                        As a teacher, your reports are trusted and mark articles immediately.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: "8px", fontSize: "0.9em" }}>
                    Your report has been recorded. We'll review it soon.
                  </div>
                )}
              </div>
            </Alert>
          ) : (
            <>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseSharpIcon />
              </IconButton>
              <TextField
                id="outlined-multiline-flexible"
                label="Report article"
                multiline={true}
                minRows={2}
                maxRows={3}
                value={feedback}
                onChange={handleChange}
                margin="normal"
                size="small"
              />

              <DialogActions>
                <IconButton
                  type="submit"
                  onClick={reportBroken}
                  id="feedback-box"
                  aria-label="send"
                  disabled={!feedback.trim() || isSubmitting}
                  sx={{
                    color: !feedback.trim() || isSubmitting ? gray : darkBlue,
                    fontSize: "medium",
                  }}
                >
                  <SendIcon />
                </IconButton>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
