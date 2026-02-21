import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { ProgressContext } from "../contexts/ProgressContext";
import { UserContext } from "../contexts/UserContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import * as s from "./Banners.sc";

export default function StreakBanner() {
  const { daysPracticed } = useContext(ProgressContext);
  const { userDetails } = useContext(UserContext);
  const history = useHistory();

  if (!daysPracticed || daysPracticed < 2) return null;

  return (
    <s.StreakBannerContainer onClick={() => history.push("/user_dashboard?tab=time")}>
      <s.FlagImage src={`/static/flags-new/${userDetails?.learned_language}.svg`} alt="" />
      <s.StreakValue>{daysPracticed}</s.StreakValue>
      <s.StreakLabel>
        {strings.streakDay} {strings.streakStreak}
      </s.StreakLabel>
      <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
    </s.StreakBannerContainer>
  );
}
