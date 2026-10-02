import { useContext, useEffect, useRef, useState } from "react";
import ReportIcon from "../components/Icons/ReportIcon";
import { APIContext } from "../contexts/APIContext";
import ReportDialog from "../components/ReportDialog";

// One tap covers the common cases; the text box is for anything else or detail.
export const ARTICLE_REPORT_REASONS = [
  "Not an article (quiz, ad, list…)",
  "Text is broken or incomplete",
  "Behind a paywall",
  "Wrong language",
];

// What reaches the API: the picked reason, then whatever the learner typed.
// The column is 255 chars; the text box is capped at 200 to leave room.
export function composeReportText(reason, feedback) {
  return [reason, feedback.trim()].filter(Boolean).join(": ");
}

// The dialog on its own, so it can be opened from anywhere (the reader's toolbar
// icon, an article card's overflow menu). `onReported` runs as soon as the
// report is in, even if the learner has already closed the dialog.
export function ReportBrokenArticleDialog({ articleID, sourceID, UMR_SOURCE, open, onClose, onReported }) {
  const api = useContext(APIContext);
  const [feedback, setFeedback] = useState("");
  const [reason, setReason] = useState(null);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);
  const [error, setError] = useState(null);
  // The thank-you closes itself after 2s. That timer, and a response that
  // arrives after the learner closed the dialog, must not touch a dialog that
  // has since been closed (or reopened).
  const closeTimer = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Start from an empty form on every open. Resetting on close instead would
  // flash the empty form in place of the thank-you during the fade-out.
  useEffect(() => {
    if (open) {
      setFeedback("");
      setReason(null);
      setIsFeedbackSent(false);
      setIsSubmitting(false);
      setError(null);
      setReportInfo(null);
    }
  }, [open]);

  const handleClose = () => {
    clearTimeout(closeTimer.current);
    onClose();
  };

  function reportBroken() {
    setIsSubmitting(true);
    setError(null);

    const text = composeReportText(reason, feedback);

    api.reportBrokenArticle(
      articleID,
      text,
      (response) => {
        setIsSubmitting(false);
        if (response.status === "success") {
          // Also log for analytics
          api.logUserActivity(api.USER_FEEDBACK, articleID, text, UMR_SOURCE, sourceID);
          if (onReported) onReported(response);

          if (!openRef.current) return;
          setIsFeedbackSent(true);
          setReportInfo(response);
          closeTimer.current = setTimeout(handleClose, 2000);
        } else {
          setError("Failed to submit report. Please try again.");
        }
      },
      (error) => {
        setIsSubmitting(false);
        setError("Network error. Please check your connection and try again.");
      },
    );
  }

  const handleChange = (e) => {
    setFeedback(e.target.value);
    setIsFeedbackSent(false);
  };

  return (
    <ReportDialog
      open={open}
      onClose={handleClose}
      title="Report broken article"
      error={error}
      isFeedbackSent={isFeedbackSent}
      reportInfo={reportInfo}
      reasons={ARTICLE_REPORT_REASONS}
      selectedReason={reason}
      onReasonChange={setReason}
      feedback={feedback}
      onFeedbackChange={handleChange}
      onSubmit={reportBroken}
      isSubmitting={isSubmitting}
    />
  );
}

export default function ReportBrokenArticle({ articleID, sourceID, UMR_SOURCE }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ReportIcon onClick={() => setOpen(true)} />

      <ReportBrokenArticleDialog
        articleID={articleID}
        sourceID={sourceID}
        UMR_SOURCE={UMR_SOURCE}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
