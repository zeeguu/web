import { useContext, useState } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import LanguageModal from "./MainNav/LanguageModal";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage.js";
import * as s from "./Banners.sc";

export default function TopBar() {
  const { daysPracticed } = useContext(ProgressContext);
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDailyFeedback, setShowDailyFeedback] = useState(
    () => Feature.daily_feedback() && !LocalStorage.didShowDailyFeedbackToday(),
  );

  const hasStreak = daysPracticed && daysPracticed >= 2;

  function handleFeedbackClick() {
    setShowDailyFeedback(false);
    LocalStorage.setDailyFeedbackShown();
  }

  return (
    <>
      <s.TopBarContainer>
        <s.FlagButton
          onClick={() => setShowLanguageModal(true)}
          aria-label="Change language"
        >
          <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
        </s.FlagButton>
        {showDailyFeedback && (
          <s.DailyFeedbackLink
            href="https://forms.gle/h5JQmVrnZNnuvSPw9"
            target="_blank"
            onClick={handleFeedbackClick}
          >
            Daily Feedback
          </s.DailyFeedbackLink>
        )}
        {hasStreak && (
          <s.StreakInfo>
            <s.StreakValue>{daysPracticed}</s.StreakValue>
            <s.StreakLabel>
              {strings.streakDay} {strings.streakStreak}
            </s.StreakLabel>
            <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
          </s.StreakInfo>
        )}
      </s.TopBarContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={() => setShowLanguageModal(false)}
      />
    </>
  );
}
