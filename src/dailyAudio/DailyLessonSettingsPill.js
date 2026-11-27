import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { ConfigPill } from "./TodayEpisodeCard.sc";
import { findA0Situation } from "./a0Situations";

// Opens the daily-lesson settings dialog. Shown under today's lesson and on
// the "no lesson yet" screen, so settings are reachable before generating.
// It says "Next lesson settings": the settings apply from the next lesson, and
// a topic or situation as its label made the pill too long. The subject is in
// its title and aria-label ("☕ At the café").
// a0: the subject is named from the A0 list only for an A0 learner; anyone
// else's topic is named as they typed it.
export function subjectLabel(subject, a0 = false) {
  if (!subject || !subject.trim()) return null;
  const situation = a0 ? findA0Situation(subject) : null;
  return situation ? `${situation.emoji} ${situation.label}` : subject.trim();
}

export default function DailyLessonSettingsPill({ onClick, style, subject, a0 }) {
  const label = subjectLabel(subject, a0);
  return (
    <ConfigPill
      onClick={onClick}
      title={label ? `Next lesson settings: ${label}` : "Next lesson settings"}
      aria-label={label ? `Next lesson settings: ${label}` : "Next lesson settings"}
      style={{ maxWidth: "100%", ...style }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Next lesson settings</span>
      <SettingsRoundedIcon style={{ fontSize: "0.95rem", flexShrink: 0 }} />
    </ConfigPill>
  );
}
