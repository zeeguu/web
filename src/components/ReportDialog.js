import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import Alert from "@mui/material/Alert";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import {
  reportDialogContentStyles,
  reportDialogCloseButtonStyles,
  reportDialogSendButtonStyles,
  reportDialogSuccessTextStyles,
  reportDialogSuccessItalicStyles,
} from "./ReportDialog.styles";

export default function ReportDialog({
  open,
  onClose,
  title = "Report",
  error,
  isFeedbackSent,
  reportInfo,
  // Optional one-tap reasons. With one picked, the text box becomes optional.
  reasons = [],
  selectedReason = null,
  onReasonChange = () => {},
  feedback = "",
  onFeedbackChange = () => {},
  onSubmit = () => {},
  isSubmitting = false,
}) {
  const canSubmit = (Boolean(selectedReason) || Boolean(feedback.trim())) && !isSubmitting;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <b>{title}</b>
      </DialogTitle>
      <DialogContent sx={reportDialogContentStyles}>
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
                <div style={reportDialogSuccessTextStyles}>
                  This article has been marked as broken and won't be shown to other users.
                  {reportInfo.is_teacher && (
                    <div style={reportDialogSuccessItalicStyles}>
                      As a teacher, your reports are trusted and mark articles immediately.
                    </div>
                  )}
                </div>
              ) : (
                <div style={reportDialogSuccessTextStyles}>Your report has been recorded. We'll review it soon.</div>
              )}
            </div>
          </Alert>
        ) : (
          <>
            <IconButton aria-label="close" onClick={onClose} sx={reportDialogCloseButtonStyles}>
              <CloseSharpIcon />
            </IconButton>

            {reasons.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {reasons.map((reason) => (
                  <Chip
                    key={reason}
                    label={reason}
                    clickable
                    color={selectedReason === reason ? "primary" : "default"}
                    variant={selectedReason === reason ? "filled" : "outlined"}
                    onClick={() => onReasonChange(selectedReason === reason ? null : reason)}
                  />
                ))}
              </div>
            )}

            <TextField
              id="outlined-multiline-flexible"
              label={reasons.length > 0 ? "Anything else? (optional)" : "Type problem here"}
              multiline={true}
              minRows={2}
              maxRows={3}
              value={feedback}
              onChange={(e) => onFeedbackChange(e)}
              margin="normal"
              size="small"
              // The stored reason is 255 chars, and a picked reason is prepended.
              inputProps={{ maxLength: 200 }}
            />

            <DialogActions>
              <IconButton
                type="submit"
                onClick={onSubmit}
                id="feedback-box"
                aria-label="send"
                disabled={!canSubmit}
                sx={reportDialogSendButtonStyles(!canSubmit)}
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
