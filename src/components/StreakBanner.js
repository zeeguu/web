import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { ProgressContext } from "../contexts/ProgressContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import strings from "../i18n/definitions";
import * as s from "./StreakBanner.sc";

export default function StreakBanner() {
  const { daysPracticed } = useContext(ProgressContext);
  const history = useHistory();

  if (!daysPracticed || daysPracticed < 2) return null;

  return (
    <s.StreakBannerContainer onClick={() => history.push("/user_dashboard?tab=time")}>
      <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
      <s.StreakValue>{daysPracticed}</s.StreakValue>
      <s.StreakLabel>{strings.streakDayStreak}</s.StreakLabel>
    </s.StreakBannerContainer>
  );
}
