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
// icon, an article card's overflow menu).
//
// `onReported(response, { afterClose })` runs as soon as a report is in.
// `afterClose` is true when the learner had already closed (or closed and
// reopened) the dialog by then. `onClose({ reported })` says whether this open
// produced a report.
export function ReportBrokenArticleDialog({ articleID, sourceID, UMR_SOURCE, open, onClose, onReported }) {
  const api = useContext(APIContext);
  const [feedback, setFeedback] = useState("");
  const [reason, setReason] = useState(null);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);
  const [error, setError] = useState(null);
  // The thank-you closes itself after 2s. That timer, and a response that
  // arrives late, must not touch a dialog that has since been closed or
  // reopened: each open gets a number, and a response only updates the open
  // it was sent from.
  const closeTimer = useRef(null);
  const openNumber = useRef(0);
  const isOpen = useRef(open);
  const reportedThisOpen = useRef(false);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Start from an empty form on every open. Resetting on close instead would
  // flash the empty form in place of the thank-you during the fade-out.
  useEffect(() => {
    isOpen.current = open;
    if (open) {
      openNumber.current += 1;
      reportedThisOpen.current = false;
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
    isOpen.current = false;
    onClose({ reported: reportedThisOpen.current });
  };

  function reportBroken() {
    setIsSubmitting(true);
    setError(null);

    const text = composeReportText(reason, feedback);
    const sentFrom = openNumber.current;

    api.reportBrokenArticle(
      articleID,
      text,
      (response) => {
        setIsSubmitting(false);
        if (response.status === "success") {
          // Also log for analytics
          api.logUserActivity(api.USER_FEEDBACK, articleID, text, UMR_SOURCE, sourceID);
          const afterClose = !isOpen.current || sentFrom !== openNumber.current;
          if (onReported) onReported(response, { afterClose });
          if (afterClose) return;

          reportedThisOpen.current = true;
          setIsFeedbackSent(true);
          setReportInfo(response);
          closeTimer.current = setTimeout(handleClose, 2000);
        } else {
          setError("Failed to submit report. Please try again.");
        }
      },
      (error) => {
        if (!isOpen.current || sentFrom !== openNumber.current) return;
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
