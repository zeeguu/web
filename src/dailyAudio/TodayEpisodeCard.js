import React from "react";
import LessonPlaybackView from "./LessonPlaybackView";
import { LessonTitle, LessonMetadata, CompletionCheck, SubtleTextButton } from "./LessonView.sc";
import { LessonTypeChip, chipLabel } from "./lessonTypeChip";
import { todayDateLabel, formatDurationMinutes } from "./audioUtils";

// Design-B "episode card" header: reads like today's episode of a show that
// renews every morning — TODAY · date, a type chip, the title, and a compact
// metadata line.
function EpisodeHeader({ lessonData, words }) {
  const hasSubject =
    lessonData.lesson_type === "topic" || lessonData.lesson_type === "situation";

  const metaParts = [
    formatDurationMinutes(lessonData.duration_seconds),
    hasSubject ? lessonData.canonical_suggestion : null,
    words && words.length > 0 ? `${words.length} words` : null,
  ].filter(Boolean);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          Today · {todayDateLabel()}
        </span>
        <LessonTypeChip $type={lessonData.lesson_type} style={{ marginBottom: 0 }}>
          {chipLabel(lessonData.lesson_type)}
        </LessonTypeChip>
      </div>

      <LessonTitle style={{ marginTop: "8px" }}>
        {lessonData.title}
        {lessonData.is_completed && <> <CompletionCheck>✓</CompletionCheck></>}
      </LessonTitle>

      {metaParts.length > 0 && <LessonMetadata>🎧 {metaParts.join(" · ")}</LessonMetadata>}
    </>
  );
}

function freshLine(lessonData) {
  if (lessonData.lesson_type === "topic" || lessonData.lesson_type === "situation") {
    return `A fresh ${lessonData.canonical_suggestion} lesson, every morning.`;
  }
  return "A fresh vocabulary lesson, every morning.";
}

/**
 * The Today view's main state: today's pre-generated lesson, ready to play.
 * Reuses LessonPlaybackView for all the player/words/feedback plumbing and
 * injects the Design-B header + footer.
 */
export default function TodayEpisodeCard({ onChangeTopic, onSeePastLessons, ...playbackProps }) {
  const { lessonData, words } = playbackProps;

  const footer = (
    <div style={{ marginTop: "24px", textAlign: "center" }}>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 8px" }}>
        {lessonData.is_completed
          ? "You're done for today — a fresh lesson arrives tomorrow 🌅"
          : freshLine(lessonData)}
      </p>
      <div>
        <SubtleTextButton onClick={onChangeTopic}>Change daily topic</SubtleTextButton>
        <SubtleTextButton onClick={onSeePastLessons}>See past lessons →</SubtleTextButton>
      </div>
    </div>
  );

  return (
    <LessonPlaybackView
      {...playbackProps}
      header={<EpisodeHeader lessonData={lessonData} words={words} />}
      footer={footer}
    />
  );
}
