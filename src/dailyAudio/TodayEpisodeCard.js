import React from "react";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LessonPlaybackView from "./LessonPlaybackView";
import { LessonTitle, LessonMetadata, CompletionCheck } from "./LessonView.sc";
import { LessonTypeChip, chipLabel } from "./lessonTypeChip";
import { todayDateLabel, completionChecks } from "./audioUtils";
import {
  ConfigPill,
  NewPill,
  DateLineWrapper,
  DateText,
  FooterWrapper,
  FooterMessage,
  LessonTitleWrapper,
} from "./TodayEpisodeCard.sc";

// Design-B "episode card" header: a date line, the title (with one ✓ per
// listen), then a single category chip — "Type: subject" — exactly like the
// past-lessons list, so the subject lives inside the pill (no wrap-under).
function EpisodeHeader({ lessonData, currentPlaybackTime }) {
  // "NEW" only while today's lesson is untouched — it answers "have I started
  // this?" and disappears the moment they begin playing. Two signals: the live
  // playback time hides it instantly on first play this session; the stored
  // position (same field the player resumes from) makes it stay gone after a
  // reload. Hidden when paused (the ⏸ label already tells that story).
  const storedSeconds =
    lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0;
  const playedSeconds = Math.max(storedSeconds, currentPlaybackTime || 0);
  const showNew = !lessonData.paused && !lessonData.is_completed && playedSeconds === 0;
  return (
    <>
      <DateLineWrapper>
        <DateText>{todayDateLabel()}</DateText>
        {showNew && <NewPill>New</NewPill>}
      </DateLineWrapper>

      <LessonTitleWrapper>
        <LessonTitle>
          {lessonData.title}
          {lessonData.is_completed && (
            <>
              {" "}
              <CompletionCheck>{completionChecks(Math.max(1, lessonData.listened_count || 1))}</CompletionCheck>
            </>
          )}
        </LessonTitle>
      </LessonTitleWrapper>

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

  // "Listen halfway to keep daily lessons coming automatically." — shown only
  // when the learner has STARTED this lesson but hasn't reached the 50%
  // engagement threshold. That threshold only gates the AUTOMATIC daily delivery
  // (the nightly cron pauses when the last lesson wasn't engaged with); the
  // learner can always manually generate a new one, so the copy is about the
  // auto-cadence, NOT a hard unlock. Uses the furthest position reached
  // (max_position_seconds — the same monotonic measure the backend gates on),
  // plus the live playhead, so a rewind doesn't make the hint reappear after
  // they've already passed halfway.
  const duration = lessonData.duration_seconds || 0;
  const furthest = Math.max(
    lessonData.max_position_seconds || 0,
    lessonData.pause_position_seconds || 0,
    playbackProps.currentPlaybackTime || 0,
  );
  // Not when `paused` — that state shows its own "Daily lessons paused" line
  // (and the ⏸ header), so adding this would be a third overlapping message.
  const showEngagementHint =
    !lessonData.paused && !lessonData.is_completed && duration > 0 && furthest > 0 && furthest < 0.5 * duration;

  // The only status worth showing is "paused" — for daily lessons, a "next
  // lesson: tomorrow" line is tautological (it's daily, of course it's
  // tomorrow), so we don't render it. `paused` is the API's engagement gate: a
  // waiting lesson the learner hasn't engaged with, so new ones are held.
  // The gear opens lesson-TYPE config (frequency config is future work).
  const footer = (
    <FooterWrapper>
      {lessonData.paused && <FooterMessage>Finish this lesson to have a new one tomorrow!</FooterMessage>}
      {showEngagementHint && (
        <FooterMessage $small>Listen halfway to keep daily lessons coming automatically.</FooterMessage>
      )}
      <ConfigPill onClick={onChangeTopic} title="Daily lesson settings">
        <span>Daily lesson settings</span>
        <SettingsRoundedIcon style={{ fontSize: "0.95rem" }} />
      </ConfigPill>
    </FooterWrapper>
  );

  return (
    <LessonPlaybackView
      {...playbackProps}
      header={<EpisodeHeader lessonData={lessonData} currentPlaybackTime={playbackProps.currentPlaybackTime} />}
      footer={footer}
    />
  );
}
