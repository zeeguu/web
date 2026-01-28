import { useContext } from "react";
import { ProgressContext } from "../contexts/ProgressContext";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import * as s from "./StreakBanner.sc";

export default function StreakBanner() {
  const { daysPracticed } = useContext(ProgressContext);

  if (!daysPracticed || daysPracticed <= 0) return null;

  return (
    <s.StreakBannerContainer>
      <LocalFireDepartmentIcon sx={{ color: "#ff9800", fontSize: "1.2rem" }} />
      <s.StreakValue>{daysPracticed}</s.StreakValue>
      <s.StreakLabel>{daysPracticed === 1 ? "day" : "day streak"}</s.StreakLabel>
    </s.StreakBannerContainer>
  );
}
