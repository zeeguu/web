import { useState } from "react";
import * as s from "./Banners.sc";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage.js";

export default function DailyFeedbackBanner() {
  const [showDailyFeedback, setShowDailyFeedback] = useState(() => !LocalStorage.didShowDailyFeedbackToday());

  function handleClick() {
    setShowDailyFeedback(false);
    LocalStorage.setDailyFeedbackShown();
  }

  if (!showDailyFeedback) return null;
  return (
    <s.DailyFeedbackBannerContainer>
      <a href="https://forms.gle/h5JQmVrnZNnuvSPw9" target="_blank" onClick={handleClick}>
        Daily Feedback
      </a>
    </s.DailyFeedbackBannerContainer>
  );
}
