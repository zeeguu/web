import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { ConfigPill } from "./TodayEpisodeCard.sc";
import { findA0Situation } from "./a0Situations";

// Opens the daily-lesson settings dialog. Shown under today's lesson and on
// the "no lesson yet" screen, so settings are reachable before generating.
// With a topic or situation set, the pill names it ("☕ At the café"), which
// says more than "Daily lesson settings" and is what the learner wants to change.
export function subjectLabel(subject) {
  if (!subject || !subject.trim()) return null;
  const situation = findA0Situation(subject);
  return situation ? `${situation.emoji} ${situation.label}` : subject.trim();
}

export default function DailyLessonSettingsPill({ onClick, style, subject }) {
  const label = subjectLabel(subject);
  return (
    <ConfigPill onClick={onClick} title="Daily lesson settings" style={{ maxWidth: "100%", ...style }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label || "Daily lesson settings"}
      </span>
      <SettingsRoundedIcon style={{ fontSize: "0.95rem", flexShrink: 0 }} />
    </ConfigPill>
  );
}
