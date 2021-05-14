import * as s from "../userDashboard_Styled/UserDashboard.sc";
import { FEEDBACK } from "../ConstantsUserDashboard";

export default function FeedbackButton({ api }) {
  function handleFeedback() {
    var user_feedback = prompt(FEEDBACK.ALERT_TEXT);
    api.logUserActivity(api.USER_DASHBOARD_USER_FEEDBACK, "", user_feedback);
  }
  return (
    <s.UserDashboardFeedbackButton onClick={() => handleFeedback()}>
      {FEEDBACK.BUTTON_TEXT}
    </s.UserDashboardFeedbackButton>
  );
}
