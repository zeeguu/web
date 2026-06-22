import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { gray, darkBlue } from "./colors";

export default function ReportDialog({
  open,
  onClose,
  title = "Report",
  error,
  isFeedbackSent,
  reportInfo,
  feedback = "",
  onFeedbackChange = () => {},
  onSubmit = () => {},
  isSubmitting = false,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <b>{title}</b>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDisplay: "row", paddingTop: "0px", minWidth: "14em" }}>
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
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
              <CloseSharpIcon />
            </IconButton>

            <TextField
              id="outlined-multiline-flexible"
              label="Type problem here"
              multiline={true}
              minRows={2}
              maxRows={3}
              value={feedback}
              onChange={(e) => onFeedbackChange(e)}
              margin="normal"
              size="small"
            />

            <DialogActions>
              <IconButton
                type="submit"
                onClick={onSubmit}
                id="feedback-box"
                aria-label="send"
                disabled={!feedback.trim() || isSubmitting}
                sx={{ color: !feedback.trim() || isSubmitting ? gray : darkBlue, fontSize: "medium" }}
              >
                <SendIcon />
              </IconButton>
            </DialogActions>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
