import { useContext, useState } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import LanguageModal from "./MainNav/LanguageModal";
import * as s from "./Banners.sc";

export default function TopBar() {
  const { daysPracticed } = useContext(ProgressContext);
  const { userDetails } = useContext(UserContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const hasStreak = daysPracticed && daysPracticed >= 2;

  return (
    <>
      <s.TopBarContainer>
        <s.FlagButton
          onClick={() => setShowLanguageModal(true)}
          aria-label="Change language"
        >
          <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
        </s.FlagButton>
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
