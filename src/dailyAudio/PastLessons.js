import React, { useState, useContext, useEffect } from "react";
import { zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import useListeningSession from "../hooks/useListeningSession";
import { LessonMetadata, SubtleTextButton } from "./LessonView.sc";
import { shareLessonLink } from "./shareLessonLink";

export default function PastLessons() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;
  const [pastLessons, setPastLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
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

  if (isLoading && pastLessons.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Loading your past lessons...</p>
        </LoadingAnimation>
      </div>
    );
  }

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
            <PastLessonItem
              key={lesson.lesson_id}
              lesson={lesson}
              api={api}
              userDetails={userDetails}
              onLessonCompleted={(lessonId) => {
                setPastLessons((prev) =>
                  prev.map((l) =>
                    l.lesson_id === lessonId
                      ? {
                          ...l,
                          is_completed: true,
                          completed_at: new Date().toISOString(),
                        }
                      : l,
                  ),
                );
              }}
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
    </div>
  );
}

function PastLessonItem({ lesson, api, userDetails, onLessonCompleted }) {
  const listeningSession = useListeningSession(lesson.lesson_id);

  return (
    <div
      style={{
        border: `1px solid ${lesson.is_completed ? "#28a745" : "var(--border-light)"}`,
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: lesson.is_completed ? "#009c00" : zeeguuOrange,
            }}
          >
            {lesson.is_completed && <span style={{ color: "#28a745", fontSize: "16px" }}>✓</span>}
            {new Date(lesson.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            : {lesson.title || "Past Audio Lesson"}
          </h3>
          {lesson.canonical_suggestion && (
            <LessonMetadata>
              {lesson.lesson_type === "situation" ? "Situation" : "Topic"}: <b>{lesson.canonical_suggestion}</b>
            </LessonMetadata>
          )}
          {lesson.is_completed && lesson.completed_at && (
            <span
              style={{
                fontSize: "12px",
                color: "#28a745",
                fontWeight: "500",
              }}
            >
              Completed
            </span>
          )}
        </div>
        {lesson.lesson_id && (
          <SubtleTextButton onClick={() => shareLessonLink(lesson.lesson_id, lesson.title)}>
            Share
          </SubtleTextButton>
        )}
      </div>

      {lesson.audio_url && (
        <div style={{ marginBottom: "16px" }}>
          <CustomAudioPlayer
            src={`${api.baseAPIurl}${lesson.audio_url}?session=${api.session}`}
            initialProgress={
              lesson.pause_position_seconds || lesson.position_seconds || lesson.progress_seconds || 0
            }
            language={userDetails?.learned_language}
            title={lesson.title || "Past Audio Lesson"}
            artist={`Zeeguu - ${new Date(lesson.created_on).toLocaleDateString()}`}
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
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          />
        </div>
      )}
    </div>
  );
}
