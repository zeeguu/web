import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { ConfigPill } from "./TodayEpisodeCard.sc";
import { findA0Situation } from "./a0Situations";

// Opens the daily-lesson settings dialog. Shown under today's lesson and on
// the "no lesson yet" screen, so settings are reachable before generating.
// With a topic or situation set, the pill names it ("☕ At the café"), which
// says more than "Daily lesson settings" and is what the learner wants to change.
// a0: the subject is named from the A0 list only for an A0 learner; anyone
// else's topic is shown as they typed it.
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
      title="Daily lesson settings"
      aria-label={label ? `Daily lesson settings: ${label}` : "Daily lesson settings"}
      style={{ maxWidth: "100%", ...style }}
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label || "Daily lesson settings"}
      </span>
      <SettingsRoundedIcon style={{ fontSize: "0.95rem", flexShrink: 0 }} />
    </ConfigPill>
  );
}
