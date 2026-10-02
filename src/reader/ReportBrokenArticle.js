import { useContext, useState } from "react";
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

// The dialog on its own, so it can be opened from anywhere (the reader's toolbar
// icon, an article card's overflow menu). `onReported` runs once the report is in.
export function ReportBrokenArticleDialog({ articleID, sourceID, UMR_SOURCE, open, onClose, onReported }) {
  const api = useContext(APIContext);
  const [feedback, setFeedback] = useState("");
  const [reason, setReason] = useState(null);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setFeedback("");
    setReason(null);
    setIsFeedbackSent(false);
    setError(null);
    setReportInfo(null);
    onClose();
  };

  function reportBroken() {
    setIsSubmitting(true);
    setError(null);

    const text = [reason, feedback.trim()].filter(Boolean).join(": ");

    api.reportBrokenArticle(
      articleID,
      text,
      (response) => {
        setIsSubmitting(false);
        if (response.status === "success") {
          setIsFeedbackSent(true);
          setReportInfo(response);

          // Also log for analytics
          api.logUserActivity(api.USER_FEEDBACK, articleID, text, UMR_SOURCE, sourceID);

          setTimeout(() => {
            handleClose();
            if (onReported) onReported(response);
          }, 2000);
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
