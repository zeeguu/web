import { useContext, useState } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import LanguageModal from "./MainNav/LanguageModal";
import * as s from "./Banners.sc";

export default function StreakBanner() {
  const { daysPracticed } = useContext(ProgressContext);
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  if (!daysPracticed || daysPracticed < 2) return null;

  return (
    <>
      <s.StreakBannerContainer>
        <s.FlagButton
          onClick={(e) => {
            e.stopPropagation();
            setShowLanguageModal(true);
          }}
          aria-label="Change language"
        >
          <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
        </s.FlagButton>
        <s.StreakInfo>
          <s.StreakValue>{daysPracticed}</s.StreakValue>
          <s.StreakLabel>
            {strings.streakDay} {strings.streakStreak}
          </s.StreakLabel>
          <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
        </s.StreakInfo>
      </s.StreakBannerContainer>
      <LanguageModal
        open={showLanguageModal}
        setOpen={() => setShowLanguageModal(false)}
      />
    </>
  );
}
