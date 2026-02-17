import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import strings from "../i18n/definitions";
import * as s from "./StreakBanner.sc";
import Feature from "../features/Feature";

export default function DailyFeedbackBanner() {
  const [showDailyFeedback, setShowDailyFeedback] = useState(true);

  function handleClick() {
    setShowDailyFeedback(false);
    localStorage.setItem("last_date", new Date().toDateString());
  }
  function didWeGetFeedbackToday() {
    let last_date = localStorage.getItem("last_date");
    let today = new Date().toDateString();

    return today == last_date;
    //return today == last_date ? true : false;
  }
  if (didWeGetFeedbackToday()) return null;
  if (!Feature.daily_feedback()) return null;

  if (!showDailyFeedback) return null;
  return (
    <s.DailyFeedbackBannerContainer>
      <a href="https://forms.gle/h5JQmVrnZNnuvSPw9" target="_blank" onClick={handleClick}>
        Daily Feedback
      </a>
    </s.DailyFeedbackBannerContainer>
  );
}
