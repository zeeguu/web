import { useCallback, useContext, useState } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import LanguageModal from "./MainNav/LanguageModal";
import LanguageStreakBar from "./LanguageStreakBar";
import Feature from "../features/Feature";
import LocalStorage from "../assorted/LocalStorage.js";
import * as s from "./Banners.sc";

const fireIconSx = { color: "#ff9800", fontSize: "1.2rem" };

export default function TopBar() {
  const { daysPracticed } = useContext(ProgressContext);
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showDailyFeedback, setShowDailyFeedback] = useState(
    () => Feature.daily_feedback() && !LocalStorage.didShowDailyFeedbackToday(),
  );
  const [hasMultipleLanguages, setHasMultipleLanguages] = useState(false);

  const hasStreak = daysPracticed && daysPracticed >= 2;
  const closeLanguageModal = useCallback(() => setShowLanguageModal(false), []);
  const openLanguageModal = useCallback(() => setShowLanguageModal(true), []);

  function handleFeedbackClick() {
    setShowDailyFeedback(false);
    LocalStorage.setDailyFeedbackShown();
  }

  return (
    <>
      <s.TopBarContainer>
        {!hasMultipleLanguages && (
          <s.FlagButton
            onClick={openLanguageModal}
            aria-label="Change language"
          >
            <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
          </s.FlagButton>
        )}
        {showDailyFeedback && (
          <s.DailyFeedbackLink
            href="https://forms.gle/h5JQmVrnZNnuvSPw9"
            target="_blank"
            onClick={handleFeedbackClick}
          >
            Daily Feedback
          </s.DailyFeedbackLink>
        )}
        <LanguageStreakBar
          onMultipleLanguages={setHasMultipleLanguages}
          onOpenModal={openLanguageModal}
        />
        {!hasMultipleLanguages && hasStreak && (
          <s.StreakInfo>
            <s.StreakValue>{daysPracticed}</s.StreakValue>
            <s.StreakLabel>
              {strings.streakDay} {strings.streakStreak}
            </s.StreakLabel>
            <LocalFireDepartmentIcon sx={fireIconSx} />
          </s.StreakInfo>
        )}
      </s.TopBarContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={closeLanguageModal}
      />
    </>
  );
}
