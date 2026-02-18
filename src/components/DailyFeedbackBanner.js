import { useContext, useState } from "react";
import * as s from "./Banners.sc";
import Feature from "../features/Feature";

export default function DailyFeedbackBanner() {
  const [showDailyFeedback, setShowDailyFeedback] = useState(true);

  function handleClick() {
    setShowDailyFeedback(false);
    localStorage.setItem("last_date", new Date().toDateString());
  }
  function didWeGetFeedbackToday() {
    let lastDate = localStorage.getItem("last_date");
    let today = new Date().toDateString();

    return today === lastDate;
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
