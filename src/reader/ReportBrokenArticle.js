import { useContext, useState } from "react";
import ReportIcon from "../components/Icons/ReportIcon";
import { APIContext } from "../contexts/APIContext";
import ReportDialog from "../components/ReportDialog";

export default function ReportBrokenArticle({ articleID, sourceID, UMR_SOURCE }) {
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
      },
    );
  }

  const handleChange = (e) => {
    setFeedback(e.target.value);
    setIsFeedbackSent(false);
  };

  return (
    <>
      <ReportIcon onClick={handleClickOpen} />

      <ReportDialog
        open={open}
        onClose={handleClose}
        title="Report broken article"
        error={error}
        isFeedbackSent={isFeedbackSent}
        reportInfo={reportInfo}
        feedback={feedback}
        onFeedbackChange={handleChange}
        onSubmit={reportBroken}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
