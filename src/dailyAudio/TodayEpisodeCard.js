import React from "react";
import styled from "styled-components";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LessonPlaybackView from "./LessonPlaybackView";
import { LessonTitle, LessonMetadata, CompletionCheck } from "./LessonView.sc";
import { LessonTypeChip, chipLabel } from "./lessonTypeChip";
import { todayDateLabel, completionChecks } from "./audioUtils";

// Config pill, styled like the Discover screen's "Topics: … ⚙" control but with
// theme tokens (not hardcoded white) so it renders as a pill in light AND dark.
const ConfigPill = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border-light);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.15s, color 0.15s;

  &:active {
    transform: scale(0.97);
  }
`;

// Design-B "episode card" header: a date line, the title (with one ✓ per
// listen), then a single category chip — "Type: subject" — exactly like the
// past-lessons list, so the subject lives inside the pill (no wrap-under).
function EpisodeHeader({ lessonData }) {
  return (
    <>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {lessonData.paused ? "⏸ Paused" : todayDateLabel()}
      </span>

      <LessonTitle style={{ marginTop: "8px" }}>
        {lessonData.title}
        {lessonData.is_completed && (
          <> <CompletionCheck>{completionChecks(Math.max(1, lessonData.listened_count || 1))}</CompletionCheck></>
        )}
      </LessonTitle>

      <LessonMetadata>
        <LessonTypeChip $type={lessonData.lesson_type} style={{ marginBottom: 0 }}>
          {chipLabel(lessonData.lesson_type)}
          {lessonData.canonical_suggestion ? `: ${lessonData.canonical_suggestion}` : ""}
        </LessonTypeChip>
      </LessonMetadata>
    </>
  );
}

/**
 * The Today view's main state: today's pre-generated lesson, ready to play.
 * Reuses LessonPlaybackView for all the player/words/feedback plumbing and
 * injects the Design-B header + footer.
 */
export default function TodayEpisodeCard({ onChangeTopic, ...playbackProps }) {
  const { lessonData } = playbackProps;

  // Just the daily-lesson config pill (styled like the Discover screen's
  // "Topics: … ⚙" control), above the Share/Feedback utility actions. The
  // "new lesson every day" promise now lives in the settings dialog, and
  // completion is already acknowledged by the player's banner — so the footer
  // stays quiet to keep the screen uncluttered.
  const footer = (
    <div style={{ marginTop: "24px", textAlign: "center" }}>
      {lessonData.paused && (
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 12px" }}>
          New daily lessons are paused. Listen to this one and they'll start again tomorrow.
        </p>
      )}
      <ConfigPill onClick={onChangeTopic} title="Configure daily lessons">
        <span>Configure daily lessons</span>
        <SettingsRoundedIcon style={{ fontSize: "0.95rem" }} />
      </ConfigPill>
    </div>
  );

  return (
    <LessonPlaybackView
      {...playbackProps}
      header={<EpisodeHeader lessonData={lessonData} />}
      footer={footer}
    />
  );
}
