import React, { useState, useContext, useEffect } from "react";
import { zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";
import CustomAudioPlayer from "../components/CustomAudioPlayer";

export default function PastLessons() {
  const api = useContext(APIContext);
  const [pastLessons, setPastLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    loadPastLessons(0, true);
  }, [api]);

  const loadPastLessons = (newOffset, reset = false) => {
    setIsLoading(true);
    setError(null);

    api.getPastDailyLessons(
      limit,
      newOffset,
      (data) => {
        setIsLoading(false);
        if (data.lessons) {
          // Filter out lessons without audio files
          const lessonsWithAudio = data.lessons.filter(lesson => lesson.audio_exists !== false);
          
          if (reset) {
            setPastLessons(lessonsWithAudio);
          } else {
            setPastLessons(prev => [...prev, ...lessonsWithAudio]);
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
      }
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
      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {pastLessons.length === 0 && !isLoading && !error && (
        <div style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
          <p>You haven't generated any audio lessons yet.</p>
          <p>Create your first lesson in the "Today" tab!</p>
        </div>
      )}

      {pastLessons.length > 0 && (
        <div>
          {pastLessons.map((lesson, index) => (
            <div
              key={lesson.lesson_id}
              style={{
                border: `1px solid ${lesson.is_completed ? "#28a745" : "#eee"}`,
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: lesson.is_completed ? "#f8fff9" : "#fafafa"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ color: zeeguuOrange, margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    {lesson.is_completed && <span style={{ color: "#28a745", fontSize: "16px" }}>✓</span>}
                    {new Date(lesson.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  {lesson.is_completed && lesson.completed_at && (
                    <span style={{ fontSize: "12px", color: "#28a745", fontWeight: "500" }}>
                      Completed
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  {lesson.duration_seconds && (
                    <div style={{ color: "#666", fontSize: "14px" }}>
                      {Math.floor(lesson.duration_seconds / 60)}:{(lesson.duration_seconds % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                  {lesson.word_count && (
                    <div style={{ color: "#999", fontSize: "12px" }}>
                      {lesson.word_count} words
                    </div>
                  )}
                </div>
              </div>

              {lesson.audio_url && (
                <div style={{ marginBottom: "16px" }}>
                  <CustomAudioPlayer
                    src={`${api.baseAPIurl}${lesson.audio_url}?session=${api.session}`}
                    initialProgress={lesson.pause_position_seconds || lesson.position_seconds || lesson.progress_seconds || 0}
                    onPlay={() => {
                      if (lesson.lesson_id) {
                        api.updateLessonState(lesson.lesson_id, "resume");
                      }
                    }}
                    onProgressUpdate={(progressSeconds) => {
                      if (lesson.lesson_id) {
                        // Use pause action to save progress
                        api.updateLessonState(lesson.lesson_id, "pause", progressSeconds);
                      }
                    }}
                    onEnded={() => {
                      if (lesson.lesson_id) {
                        api.updateLessonState(lesson.lesson_id, "complete", null, () => {
                          // Update local state to show completion immediately
                          setPastLessons(prev => 
                            prev.map(l => 
                              l.lesson_id === lesson.lesson_id 
                                ? { ...l, is_completed: true, completed_at: new Date().toISOString() }
                                : l
                            )
                          );
                        });
                      }
                    }}
                    onError={() => {
                      console.log("Audio failed to load for lesson:", lesson.lesson_id);
                    }}
                    style={{ 
                      width: "100%",
                      maxWidth: "600px",
                      margin: "0 auto"
                    }}
                  />
                </div>
              )}

              {lesson.words && lesson.words.length > 0 && (
                <div>
                  <h4 style={{ color: "#333", fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
                    Words practiced:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {lesson.words.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        style={{
                          backgroundColor: "#e9ecef",
                          color: "#333",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                          border: "1px solid #dee2e6"
                        }}
                        title={word.translation || ""}
                      >
                        {word.origin || word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                  opacity: isLoading ? 0.6 : 1
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