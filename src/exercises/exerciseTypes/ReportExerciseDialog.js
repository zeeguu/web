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
import { TextLinkButton, UndoToastRow, SkipSeparator } from "./ReportExerciseDialog.sc";

// Chip definitions. The order here is the order the chips render.
// Each chip carries the backend `reason` enum value (matching
// api/zeeguu/core/model/exercise_report.py) and its user-facing label.
const CHIP_DEFS = {
  audio_broken: { reason: "audio_broken", label: "Audio is broken / unclear" },
  word_not_shown: { reason: "word_not_shown", label: "Word not shown" },
  wrong_highlighting: { reason: "wrong_highlighting", label: "Wrong highlighting" },
  context_confusing: { reason: "context_confusing", label: "Confusing context" },
  context_wrong: { reason: "context_wrong", label: "Context wrong" },
  wrong_translation: { reason: "wrong_translation", label: "Wrong translation" },
  other: { reason: "other", label: "Something else…" },
};

function chipsFor({ isExerciseOver }) {
  // Audio-broken applies to every exercise — auto-pronounce-on-reveal
  // plays the solution out loud in non-audio exercises too, so audio
  // issues can be reported anywhere.
  const chips = [CHIP_DEFS.audio_broken];
  if (!isExerciseOver) chips.push(CHIP_DEFS.word_not_shown);
  chips.push(CHIP_DEFS.wrong_highlighting);
  chips.push(isExerciseOver ? CHIP_DEFS.context_wrong : CHIP_DEFS.context_confusing);
  if (isExerciseOver) chips.push(CHIP_DEFS.wrong_translation);
  chips.push(CHIP_DEFS.other);
  return chips;
}

export default function ReportExerciseDialog({
  open,
  onClose,
  onSkip,
  bookmarkId,
  exerciseSource,
  isExerciseOver,
  contextUsed,
}) {
  const api = useContext(APIContext);
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chips = chipsFor({ isExerciseOver });

  function handleChipClick(reason) {
    if (reason === "other") {
      setSelectedReason("other");
    } else {
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
          toast.info("You've already reported this exercise — skipping");
          finishAndSkip();
          return;
        }
        // Reporting is a strong signal that this specific word/exercise
        // isn't working for the user — pull it out of their scheduling
        // and surface an Undo so the action is reversible.
        api.userSetNotForExercises(bookmarkId, `reported:${reason}`);
        toast.success(
          ({ closeToast }) => (
            <UndoToastRow>
              <span>Reported. Word removed from practice.</span>
              <TextLinkButton
                onClick={() => {
                  api.userSetForExercises(bookmarkId);
                  toast.info("Word restored to practice");
                  closeToast();
                }}
              >
                Undo
              </TextLinkButton>
            </UndoToastRow>
          ),
          { autoClose: 5000 },
        );
        finishAndSkip();
      },
      (_error) => {
        setIsSubmitting(false);
        toast.error("Failed to submit report");
      },
    );
  }

  function finishAndSkip() {
    setSelectedReason(null);
    setComment("");
    onClose(true);
    if (onSkip) onSkip();
  }

  function handleSkipWithoutReporting() {
    setSelectedReason(null);
    setComment("");
    onClose(false);
    if (onSkip) onSkip();
  }

  function handleClose() {
    setSelectedReason(null);
    setComment("");
    onClose(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1, pr: 6 }}>
        What's wrong?
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
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedReason !== "other" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {chips.map((chip) => (
              <Chip
                key={chip.reason}
                label={chip.label}
                onClick={() => handleChipClick(chip.reason)}
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
              placeholder="Describe the issue…"
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

        <SkipSeparator>
          <TextLinkButton
            $muted
            onClick={handleSkipWithoutReporting}
            disabled={isSubmitting}
          >
            Skip without reporting
          </TextLinkButton>
        </SkipSeparator>
      </DialogContent>
    </Dialog>
  );
}
