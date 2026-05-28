import React, { useState, useContext, useEffect } from "react";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import useListeningSession from "../hooks/useListeningSession";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import { SubtleTextButton, LessonTitle, CompletionCheck } from "./LessonView.sc";
import { SubtleLessonCard, ProgressBarTrack, ProgressBarFill } from "./SharedLessonView.sc";
import { PillRow, SelectablePill } from "./SuggestionSelector.sc";
import { LessonTypeChip, chipLabel } from "./lessonTypeChip";
import { completionChecks, formatShortDate } from "./audioUtils";
import ShareLessonButton from "./ShareLessonButton";

// Filter the back catalogue by lesson type. value=null means "All".
const TYPE_FILTERS = [
  { label: "All", value: null },
  { label: "Vocabulary", value: "three_words_lesson" },
  { label: "Topic", value: "topic" },
  { label: "Situation", value: "situation" },
];

const lessonProgressSeconds = (lesson) =>
  lesson.pause_position_seconds || lesson.position_seconds || lesson.progress_seconds || 0;

const lessonDateLabel = (lesson) => formatShortDate(new Date(lesson.created_at));

const lessonTitleText = (lesson) => lesson.title || "Past Audio Lesson";

function CollapsedProgressBar({ lesson }) {
  const duration = lesson.duration_seconds || 0;
  const pct = duration > 0
    ? Math.min(100, (lessonProgressSeconds(lesson) / duration) * 100)
    : 0;
  if (pct <= 0 || pct >= 99) return null;
  return (
    <ProgressBarTrack>
      <ProgressBarFill $pct={pct} $isCompleted={false} />
    </ProgressBarTrack>
  );
}

const titleWithDate = (lesson) => {
  const text = lessonTitleText(lesson);
  // Glue the completion check(s) to the last word so they never widow
  // onto a line by themselves.
  const lastSpace = text.lastIndexOf(" ");
  const head = lastSpace >= 0 ? text.slice(0, lastSpace + 1) : "";
  const tail = lastSpace >= 0 ? text.slice(lastSpace + 1) : text;
  const checkCount = lesson.is_completed ? Math.max(1, lesson.listened_count || 1) : 0;
  return (
    <>
      <small
        style={{
          color: "var(--text-secondary)",
          fontSize: "0.75em",
          fontWeight: 400,
          marginRight: "6px",
        }}
      >
        [{lessonDateLabel(lesson)}]
      </small>
      {head}
      <span style={{ whiteSpace: "nowrap" }}>
        {tail}
        {checkCount > 0 && <> <CompletionCheck>{completionChecks(checkCount)}</CompletionCheck></>}
      </span>
    </>
  );
};

export default function PastLessons() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;
  const [pastLessons, setPastLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [openLessonId, setOpenLessonId] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const limit = 10;

  useEffect(() => {
    loadPastLessons(0, true);
  }, [api, learnedLanguage]);

  const loadPastLessons = (newOffset, reset = false) => {
    if (reset) {
      // Clear the visible list immediately so the user gets instant feedback
      // (otherwise stale lessons from the previous language linger until the
      // — sometimes slow — new fetch returns).
      setPastLessons([]);
      setOffset(0);
      setHasMore(true);
    }
    setIsLoading(true);
    setError(null);

    api.getPastDailyLessons(
      limit,
      newOffset,
      (data) => {
        setIsLoading(false);
        if (data.lessons) {
          // Filter out lessons without audio files
          const lessonsWithAudio = data.lessons.filter((lesson) => lesson.audio_exists !== false);

          if (reset) {
            setPastLessons(lessonsWithAudio);
          } else {
            setPastLessons((prev) => [...prev, ...lessonsWithAudio]);
          }
          // Use the pagination data from backend
          if (data.pagination) {
            setHasMore(data.pagination.has_more);
            setOffset(newOffset + data.lessons.length);
          } else {
            setHasMore(data.lessons.length === limit);
            setOffset(newOffset + data.lessons.length);
          }
        } else {
          setPastLessons([]);
          setHasMore(false);
        }
      },
      (error) => {
        setIsLoading(false);
        setError(error.message || "Failed to load past lessons");
      },
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadPastLessons(offset);
    }
  };

  const onLessonCompleted = (lessonId) => {
    setPastLessons((prev) =>
      prev.map((l) =>
        l.lesson_id === lessonId
          ? {
              ...l,
              is_completed: true,
              // One ✓ per listen — bump locally so replays add a check live,
              // matching the today card (LessonPlaybackView does the same).
              listened_count: (l.listened_count || 0) + 1,
              last_completed_at: new Date().toISOString(),
            }
          : l,
      ),
    );
  };

  const onProgressUpdate = (lessonId, progressSeconds) => {
    setPastLessons((prev) => {
      let changed = false;
      const next = prev.map((l) => {
        if (l.lesson_id !== lessonId || l.pause_position_seconds === progressSeconds) return l;
        changed = true;
        return { ...l, pause_position_seconds: progressSeconds };
      });
      return changed ? next : prev;
    });
  };

  if (isLoading && pastLessons.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Loading your past lessons...</p>
        </LoadingAnimation>
      </div>
    );
  }

  const toggleLesson = (lessonId) =>
    setOpenLessonId((current) => (current === lessonId ? null : lessonId));

  // Client-side filter over the lessons loaded so far. Note: with pagination
  // this only filters the pages already fetched, so a rarely-used type may
  // show fewer than exist until more pages are loaded. (Follow-up: push the
  // lesson_type filter down to the past_daily_lessons endpoint.)
  const visibleLessons = typeFilter
    ? pastLessons.filter((lesson) => lesson.lesson_type === typeFilter)
    : pastLessons;

  return (
    <div style={{ padding: "20px" }}>
      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {pastLessons.length > 0 && (
        <PillRow role="radiogroup" aria-label="Filter lessons by type" style={{ flexWrap: "wrap", justifyContent: "center", marginBottom: "16px" }}>
          {TYPE_FILTERS.map(({ label, value }) => (
            <SelectablePill
              key={label}
              type="button"
              role="radio"
              aria-checked={typeFilter === value}
              $selected={typeFilter === value}
              onClick={() => setTypeFilter(value)}
            >
              {label}
            </SelectablePill>
          ))}
        </PillRow>
      )}

      {pastLessons.length === 0 && !isLoading && !error && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
          <p>There are no past lessons to display.</p>
        </div>
      )}

      {pastLessons.length > 0 && visibleLessons.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
          <p>No {chipLabel(typeFilter).toLowerCase()} lessons yet.</p>
        </div>
      )}

      {visibleLessons.length > 0 && (
        <div>
          {visibleLessons.map((lesson, idx) => {
            const prev = idx > 0 ? visibleLessons[idx - 1] : null;
            const categoryChanged =
              !prev ||
              prev.lesson_type !== lesson.lesson_type ||
              prev.canonical_suggestion !== lesson.canonical_suggestion;
            return (
              <React.Fragment key={lesson.lesson_id}>
                {categoryChanged && (lesson.canonical_suggestion || lesson.lesson_type === "three_words_lesson") && (
                  <LessonTypeChip $type={lesson.lesson_type} style={{ marginTop: idx > 0 ? "18px" : 0, marginLeft: "4px" }}>
                    {chipLabel(lesson.lesson_type)}
                    {lesson.canonical_suggestion ? `: ${lesson.canonical_suggestion}` : ""}
                  </LessonTypeChip>
                )}
                <PastLessonRow
                  lesson={lesson}
                  isOpen={openLessonId === lesson.lesson_id}
                  onToggle={() => toggleLesson(lesson.lesson_id)}
                  api={api}
                  userDetails={userDetails}
                  onLessonCompleted={onLessonCompleted}
                  onProgressUpdate={onProgressUpdate}
                />
              </React.Fragment>
            );
          })}

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <SubtleTextButton
                onClick={handleLoadMore}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? "Loading..." : "Load more"}
              </SubtleTextButton>
            </div>
          )}

          {!hasMore && pastLessons.length > 0 && (
            <div style={{ textAlign: "center", color: "#666", marginTop: "20px", fontSize: "14px" }}>
              No more lessons to load
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PastLessonRow({
  lesson,
  isOpen,
  onToggle,
  api,
  userDetails,
  onLessonCompleted,
  onProgressUpdate,
}) {
  // Keep the player mounted while the close animation plays out, so the
  // height can smoothly transition back to 0 instead of snapping.
  const [shouldRender, setShouldRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  return (
    <SubtleLessonCard
      onClick={onToggle}
      style={{ marginBottom: "8px", cursor: "pointer" }}
    >
      <LessonTitle
        $compact
        style={{
          fontSize: "1.15rem",
          color: "var(--text-primary)",
          fontWeight: 500,
          lineHeight: 1.4,
          letterSpacing: "-0.005em",
          marginTop: 0,
        }}
      >
        {titleWithDate(lesson)}
      </LessonTitle>
      {!isOpen && !lesson.is_completed && <CollapsedProgressBar lesson={lesson} />}
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 250ms ease",
        }}
        onTransitionEnd={(e) => {
          // transitionend bubbles — guard against descendant transitions
          // (player fades, share-button hovers, etc.) firing the unmount.
          if (e.target !== e.currentTarget || e.propertyName !== "grid-template-rows") return;
          if (!isOpen) setShouldRender(false);
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          {shouldRender && (
            // Stop clicks inside the expanded area (player controls, share
            // button) from bubbling up and collapsing the card.
            <div style={{ paddingTop: "12px" }} onClick={(e) => e.stopPropagation()}>
              <InlineLessonPlayer
                lesson={lesson}
                api={api}
                userDetails={userDetails}
                onLessonCompleted={onLessonCompleted}
                onProgressUpdate={onProgressUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </SubtleLessonCard>
  );
}

// useListeningSession's start/pause/end lifecycle is scoped to this
// component's mount/unmount — i.e. to the expanded state of the card.
function InlineLessonPlayer({ lesson, api, userDetails, onLessonCompleted, onProgressUpdate }) {
  const listeningSession = useListeningSession(lesson.lesson_id);

  return (
    <>
      <CustomAudioPlayer
        src={`${api.baseAPIurl}${lesson.audio_url}`}
        initialProgress={lessonProgressSeconds(lesson)}
        language={userDetails?.learned_language}
        title={lessonTitleText(lesson)}
        artist={`Zeeguu - ${new Date(lesson.created_at).toLocaleDateString()}`}
        style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "transparent",
          padding: 0,
        }}
        onPlay={() => {
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "resume");
            listeningSession.start();
          }
        }}
        onPause={() => {
          listeningSession.pause();
        }}
        onProgressUpdate={(progressSeconds) => {
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "pause", progressSeconds);
            onProgressUpdate(lesson.lesson_id, progressSeconds);
          }
        }}
        onEnded={() => {
          listeningSession.end();
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "complete", null, () => {
              onLessonCompleted(lesson.lesson_id);
            });
          }
        }}
        onError={() => {}}
      />
      <ShareLessonButton api={api} lessonId={lesson.lesson_id} title={lesson.title} shareUuid={lesson.share_uuid} />
    </>
  );
}
