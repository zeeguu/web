import React, { useState, useContext, useEffect } from "react";
import { zeeguuOrange, successGreen } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import useListeningSession from "../hooks/useListeningSession";
import { SubtleTextButton, CompletionCheck, LessonTitle, LessonMetadata } from "./LessonView.sc";
import { SubtleLessonCard, HeaderRow, ProgressBarTrack, ProgressBarFill } from "./SharedLessonView.sc";
import LessonPlayerCard from "./LessonPlayerCard";
import { shareLessonLink } from "./shareLessonLink";
import Modal from "../components/modal_shared/Modal";

const lessonProgressSeconds = (lesson) =>
  lesson.pause_position_seconds || lesson.position_seconds || lesson.progress_seconds || 0;

const pastLessonTitle = (lesson) => {
  const dateStr = new Date(lesson.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${dateStr}: ${lesson.title || "Past Audio Lesson"}`;
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
          ? { ...l, is_completed: true, completed_at: new Date().toISOString() }
          : l,
      ),
    );
  };

  const onProgressUpdate = (lessonId, progressSeconds) => {
    setPastLessons((prev) => {
      const current = prev.find((l) => l.lesson_id === lessonId);
      if (!current || current.pause_position_seconds === progressSeconds) return prev;
      return prev.map((l) =>
        l.lesson_id === lessonId ? { ...l, pause_position_seconds: progressSeconds } : l,
      );
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

  const openLesson = pastLessons.find((l) => l.lesson_id === openLessonId);

  return (
    <div style={{ padding: "20px" }}>
      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {pastLessons.length === 0 && !isLoading && !error && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
          <p>There are no past lessons to display.</p>
        </div>
      )}

      {pastLessons.length > 0 && (
        <div>
          {pastLessons.map((lesson) => (
            <PastLessonRow
              key={lesson.lesson_id}
              lesson={lesson}
              onOpen={() => setOpenLessonId(lesson.lesson_id)}
            />
          ))}

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                style={{
                  backgroundColor: zeeguuOrange,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {!hasMore && pastLessons.length > 0 && (
            <div style={{ textAlign: "center", color: "#666", marginTop: "20px", fontSize: "14px" }}>
              No more lessons to load
            </div>
          )}
        </div>
      )}

      <Modal open={!!openLesson} onClose={() => setOpenLessonId(null)}>
        {openLesson && (
          <PastLessonPlayer
            lesson={openLesson}
            api={api}
            userDetails={userDetails}
            onLessonCompleted={onLessonCompleted}
            onProgressUpdate={onProgressUpdate}
          />
        )}
      </Modal>
    </div>
  );
}

export function PastLessonRow({ lesson, onOpen, leadLabel }) {
  const titleText = pastLessonTitle(lesson);
  const duration = lesson.duration_seconds || 0;
  const pct = lesson.is_completed
    ? 100
    : duration > 0
      ? Math.min(100, (lessonProgressSeconds(lesson) / duration) * 100)
      : 0;

  return (
    <SubtleLessonCard
      $isCompleted={lesson.is_completed}
      onClick={onOpen}
      style={{ marginBottom: "8px", cursor: "pointer" }}
    >
      {leadLabel && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "6px",
          }}
        >
          {leadLabel}
        </div>
      )}
      <HeaderRow>
        <LessonTitle
          $compact
          style={{
            fontSize: "1rem",
            color: lesson.is_completed ? successGreen : undefined,
          }}
        >
          {titleText}
          {lesson.is_completed && <> <CompletionCheck>✓</CompletionCheck></>}
        </LessonTitle>
        {lesson.lesson_id && (
          <SubtleTextButton
            onClick={(e) => {
              e.stopPropagation();
              shareLessonLink(lesson.lesson_id, lesson.title);
            }}
          >
            Share
          </SubtleTextButton>
        )}
      </HeaderRow>
      {lesson.canonical_suggestion && (
        <LessonMetadata>
          {lesson.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lesson.canonical_suggestion}</b>
        </LessonMetadata>
      )}
      <ProgressBarTrack>
        <ProgressBarFill $pct={pct} $isCompleted={lesson.is_completed} />
      </ProgressBarTrack>
    </SubtleLessonCard>
  );
}

// Wrapped (rather than inlined into the Modal) so useListeningSession's
// start/pause/end lifecycle is scoped to the modal's mount/unmount.
export function PastLessonPlayer({ lesson, api, userDetails, onLessonCompleted, onProgressUpdate }) {
  const listeningSession = useListeningSession(lesson.lesson_id);
  const titleText = pastLessonTitle(lesson);

  const metadata = lesson.canonical_suggestion ? (
    <>
      {lesson.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lesson.canonical_suggestion}</b>
    </>
  ) : null;

  return (
    <LessonPlayerCard
      title={titleText}
      isCompleted={lesson.is_completed}
      metadata={metadata}
      headerAction={
        lesson.lesson_id && (
          <SubtleTextButton onClick={() => shareLessonLink(lesson.lesson_id, lesson.title)}>
            Share
          </SubtleTextButton>
        )
      }
      audioProps={{
        src: `${api.baseAPIurl}${lesson.audio_url}?session=${api.session}`,
        autoPlay: true,
        initialProgress: lessonProgressSeconds(lesson),
        language: userDetails?.learned_language,
        title: lesson.title || "Past Audio Lesson",
        artist: `Zeeguu - ${new Date(lesson.created_at).toLocaleDateString()}`,
        onPlay: () => {
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "resume");
            listeningSession.start();
          }
        },
        onPause: () => {
          listeningSession.pause();
        },
        onProgressUpdate: (progressSeconds) => {
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "pause", progressSeconds);
            onProgressUpdate(lesson.lesson_id, progressSeconds);
          }
        },
        onEnded: () => {
          listeningSession.end();
          if (lesson.lesson_id) {
            api.updateLessonState(lesson.lesson_id, "complete", null, () => {
              onLessonCompleted(lesson.lesson_id);
            });
          }
        },
        onError: () => {},
      }}
    />
  );
}
