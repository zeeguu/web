import { useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import { APIContext } from "../../contexts/APIContext";

// Chips shown during exercise (before answering)
const DURING_EXERCISE_OPTIONS = [
  { value: "word_not_shown", label: "Word not shown" },
  { value: "context_confusing", label: "Context confusing" },
  { value: "other", label: "Other..." },
];

// Chips shown after exercise (after answering)
const AFTER_EXERCISE_OPTIONS = [
  { value: "wrong_translation", label: "Wrong translation" },
  { value: "context_wrong", label: "Context wrong" },
  { value: "other", label: "Other..." },
];

export default function ReportExerciseDialog({
  open,
  onClose,
  bookmarkId,
  exerciseSource,
  isExerciseOver,
  contextUsed,
}) {
  const api = useContext(APIContext);
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = isExerciseOver ? AFTER_EXERCISE_OPTIONS : DURING_EXERCISE_OPTIONS;

  function handleChipClick(reason) {
    if (reason === "other") {
      setSelectedReason("other");
    } else {
      // Submit immediately for non-other options
      submitReport(reason, null);
    }
  }

  function handleSubmitOther() {
    if (!comment.trim()) {
      toast.error("Please describe the issue");
      return;
    }
    submitReport("other", comment.trim());
  }

  function submitReport(reason, commentText) {
    setIsSubmitting(true);

    api.reportExerciseIssue(
      bookmarkId,
      exerciseSource,
      reason,
      commentText,
      contextUsed,
      (response) => {
        setIsSubmitting(false);
        if (response.already_reported) {
          toast.info("You've already reported this exercise");
        } else {
          toast.success("Thanks for the feedback!");
        }
        handleClose(true);
      },
      (error) => {
        setIsSubmitting(false);
        toast.error("Failed to submit report");
      }
    );
  }

  function handleClose(reported = false) {
    setSelectedReason(null);
    setComment("");
    onClose(reported);
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        Report a problem with the exercise
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedReason !== "other" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {options.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => handleChipClick(option.value)}
                variant="outlined"
                clickable
                disabled={isSubmitting}
                sx={{
                  borderColor: "#ccc",
                  "&:hover": {
                    borderColor: "#999",
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Describe the issue..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitOther();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <IconButton
              onClick={handleSubmitOther}
              disabled={isSubmitting || !comment.trim()}
              sx={{
                backgroundColor: comment.trim() ? "#f0a000" : "#eee",
                color: comment.trim() ? "white" : "#999",
                "&:hover": {
                  backgroundColor: comment.trim() ? "#d89000" : "#ddd",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#eee",
                  color: "#999",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
