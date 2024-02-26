import { useState } from "react";
import sendFeedbackEmail from "../JSInjection/Modal/sendFeedbackEmail";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import colors from "../JSInjection/colors";
import {
  LANGUAGE_FEEDBACK,
  READABILITY_FEEDBACK,
  LANGUAGE_UNDEFINED,
} from "../JSInjection/constants";
export default function ReportError({
  api,
  feedback,
  feedbackSuccess,
  setFeedbackSuccess,
}) {
  const [feedbackSent, setFeedbackSent] = useState(false);

  const sendFeedback = (feedback) => {
    let feedbackType = "OTHER_";
    if (feedback === LANGUAGE_FEEDBACK || feedback === LANGUAGE_UNDEFINED)
      feedbackType = "LANGUAGE_";
    else if (feedback === READABILITY_FEEDBACK) feedbackType = "READABLE_";
    sendFeedbackEmail(
      api,
      feedback,
      window.location.href,
      undefined,
      feedbackType
    );
    setFeedbackSent(true);
    setFeedbackSuccess(true);
  };
  return (
    <>
      {!feedbackSent && !feedbackSuccess && (
        <Link
          style={{ textTransform: "none", color: `${colors.darkBlue}` }}
          component="button"
          underline="always"
          onClick={() => sendFeedback(feedback)}
        >
          {"Report issue"}
        </Link>
      )}
      {feedbackSent && feedbackSuccess && (
        <Alert severity="success">Thanks for the feedback</Alert>
      )}
    </>
  );
}
