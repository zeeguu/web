import React, { useContext, useEffect, useRef, useState } from "react";
import { orange500, orange600, orange800, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import LoadingAnimation from "../components/LoadingAnimation";
import CustomAudioPlayer from "../components/CustomAudioPlayer";

const TWO_MIN = 120000; // 2 minutes in milliseconds

export default function TodayAudio() {
  const api = useContext(APIContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check localStorage for ongoing generation
  useEffect(() => {
    const generatingKey = `zeeguu_generating_lesson_${new Date().toDateString()}`;
    const isCurrentlyGenerating = localStorage.getItem(generatingKey);
    if (isCurrentlyGenerating) {
      setIsGenerating(true);

      // Poll for lesson completion
      const pollInterval = setInterval(() => {
        api.getTodaysLesson(
          (data) => {
            if (data && data.lesson_id) {
              // Lesson is ready
              clearInterval(pollInterval);
              localStorage.removeItem(generatingKey);
              setIsGenerating(false);
              setLessonData(data);
            }
          },
          (error) => {
            // Only show error if it's not just "no lesson found"
            if (!error.message.includes("No lesson generated yet today")) {
              clearInterval(pollInterval);
              localStorage.removeItem(generatingKey);
              setIsGenerating(false);
              setError(error.message);
            }
          },
        );
      }, 3000); // Poll every 3 seconds

      // Clear polling after 2 minutes (timeout) but check one more time
      const timeoutId = setTimeout(() => {
        // Final check before timing out
        api.getTodaysLesson(
          (data) => {
            if (data && data.lesson_id) {
              // Lesson was actually ready
              clearInterval(pollInterval);
              localStorage.removeItem(generatingKey);
              setIsGenerating(false);
              setLessonData(data);
            } else {
              // Actually timed out
              clearInterval(pollInterval);
              localStorage.removeItem(generatingKey);
              setIsGenerating(false);
              setError("Lesson generation timed out. Please try again.");
            }
          },
          (error) => {
            clearInterval(pollInterval);
            localStorage.removeItem(generatingKey);
            setIsGenerating(false);
            setError("Lesson generation timed out. Please try again.");
          },
        );
      }, TWO_MIN);

      // Cleanup function to clear intervals if component unmounts
      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
      };
    }
  }, [api]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  let words = lessonData?.words || [];

  // Update page title when lessonData changes
  useEffect(() => {
    if (lessonData && lessonData.words) {
      document.title = `[${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}] Daily Audio: ${lessonData.words.map((word) => word.origin || word).join(", ")}`;
    } else {
      document.title = "Zeeguu: Audio Lesson";
    }
  }, [lessonData]);

  // Fetch lesson data on mount
  useEffect(() => {
    // Check if there's already a lesson for today
    setIsLoading(true);

    api.getTodaysLesson(
      (data) => {
        setIsLoading(false);
        console.log("Lesson data received:", data); // Debug log
        setLessonData(data); // data will be null if no lesson exists, or lesson object if it exists
      },
      (error) => {
        setIsLoading(false);
        console.error("Error getting today's lesson:", error);
        setError(error.message);
        setLessonData(null);
      },
    );
  }, [api]);

  const handleGenerateLesson = () => {
    const generatingKey = `zeeguu_generating_lesson_${new Date().toDateString()}`;

    setIsGenerating(true);
    setError(null);

    // Set localStorage flag to track generation across page reloads
    localStorage.setItem(generatingKey, "true");

    api.generateDailyLesson(
      (data) => {
        // Clear the localStorage flag when generation completes
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);
        console.log("Generated new lesson:", data);
        setLessonData(data);
      },
      (error) => {
        // Clear the localStorage flag on error
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);
        console.error("Error generating lesson:", error);

        // Check if the error is related to no words in learning
        if (error.message && error.message.toLowerCase().includes("not enough words in learning")) {
          setError(
            "Not enough words in learning to generate a lesson. Need at least 3 words that were not in audio lessons before",
          );
        } else {
          setError(error.message || "Failed to generate daily lesson. Please try again.");
        }
      },
    );
  };

  const handleDeleteLesson = () => {
    if (window.confirm("Are you sure you want to delete today's lesson? This action cannot be undone.")) {
      setIsDeleting(true);
      setError(null);

      api.deleteTodaysLesson(
        (data) => {
          setIsDeleting(false);
          setLessonData(null);
          // Show success message briefly
          console.log("Lesson deleted successfully:", data);
        },
        (error) => {
          setIsDeleting(false);
          console.error("Error deleting lesson:", error);
          setError(error.message || "Failed to delete lesson. Please try again.");
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Checking for existing lesson...</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <LoadingAnimation delay={0} reportIssueDelay={60000}>
          <p>Generating your daily lesson... This may take up to a minute</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <button
          onClick={handleGenerateLesson}
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            backgroundColor: orange500,
            color: "white",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: `0px 0.3rem ${orange800}`,
            transition: "all 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: "1.2",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = orange600;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = orange500;
            e.target.style.boxShadow = `0px 0.3rem ${orange800}`;
            e.target.style.transform = "translateY(0)";
          }}
          onMouseDown={(e) => {
            e.target.style.boxShadow = "none";
            e.target.style.transform = "translateY(0.2em)";
            e.target.style.transition = "all 0.08s ease-in";
          }}
          onMouseUp={(e) => {
            e.target.style.boxShadow = `0px 0.3rem ${orange800}`;
            e.target.style.transform = "translateY(0)";
            e.target.style.transition = "all 0.3s ease-in-out";
          }}
        >
          Generate
          <br />
          Daily Lesson
        </button>
        {!error && (
          <p style={{ marginBottom: "20px", textAlign: "center", maxWidth: "500px" }}>
            Push the button for... an audio lesson for you based on the words you are currently learning.
          </p>
        )}
        {error && (
          <div
            style={{
              color: "#d73502",
              marginBottom: "30px",
              marginTop: "30px",
              fontWeight: "bold",
              textAlign: "center",
              maxWidth: "600px",
              backgroundColor: "#fff5f5",
              border: "1px solid #feb2b2",
              borderRadius: "8px",
              padding: "16px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: zeeguuOrange, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        {lessonData.is_completed && <span style={{ color: "#28a745", fontSize: "20px" }}>✓</span>}
        Audio Lesson for {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </h2>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {lessonData.is_completed && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            backgroundColor: "#f8fff9",
            border: "1px solid #28a745",
            borderRadius: "4px",
          }}
        >
          <span style={{ color: "#28a745", fontWeight: "500", fontSize: "14px" }}>
            ✓ Lesson completed! Great job on finishing today's lesson.
          </span>
        </div>
      )}

      <div>
        <p style={{ marginBottom: "20px" }}>Here's your daily lesson! Listen to improve your comprehension skills.</p>

        <CustomAudioPlayer
          src={lessonData.audio_url}
          initialProgress={lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0}
          onPlay={() => {
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "resume");
            }
          }}
          onProgressUpdate={(progressSeconds) => {
            if (lessonData.lesson_id) {
              // Use pause action to save progress
              api.updateLessonState(lessonData.lesson_id, "pause", progressSeconds);
            }
          }}
          onEnded={() => {
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "complete", null, () => {
                // Update local state to show completion immediately
                setLessonData((prev) => ({
                  ...prev,
                  is_completed: true,
                  completed_at: new Date().toISOString(),
                }));
              });
            }
          }}
          onError={() => {
            console.log("Audio failed to load, trying direct fetch...");
            // If direct URL fails, try fetching as blob
            fetch(lessonData.audio_url)
              .then((response) => response.blob())
              .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                // Note: Custom player will need to handle blob URLs
              })
              .catch((err) => console.error("Failed to fetch audio as blob:", err));
          }}
          style={{
            width: "100%",
            marginBottom: "20px",
            maxWidth: "600px",
            margin: "0 auto 20px auto",
          }}
        />

        {lessonData.words && lessonData.words.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: zeeguuOrange, marginBottom: "10px" }}>Words in this lesson:</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {lessonData.words.map((word, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#f0f0f0",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                  title={word.translation || ""}
                >
                  {word.origin || word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={handleDeleteLesson}
            disabled={isDeleting}
            style={{
              backgroundColor: "transparent",
              color: "#999",
              border: "none",
              borderRadius: "0",
              padding: "4px 8px",
              fontSize: "12px",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.5 : 1,
              textDecoration: "underline",
            }}
          >
            {isDeleting ? "deleting..." : "delete lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
