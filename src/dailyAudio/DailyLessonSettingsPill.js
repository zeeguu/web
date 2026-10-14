import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { ConfigPill } from "./TodayEpisodeCard.sc";

// Opens the daily-lesson settings dialog. Shown under today's lesson and on
// the "no lesson yet" screen, so settings are reachable before generating.
export default function DailyLessonSettingsPill({ onClick, style }) {
  return (
    <ConfigPill onClick={onClick} title="Daily lesson settings" style={style}>
      <span>Daily lesson settings</span>
      <SettingsRoundedIcon style={{ fontSize: "0.95rem" }} />
    </ConfigPill>
  );
}
