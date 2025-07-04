import React, { useState, useContext, useRef, useEffect } from "react";
import { zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { OrangeButton } from "../exercises/exerciseTypes/Exercise.sc";
import LoadingAnimation from "../components/LoadingAnimation";

export default function TodayAudio() {
  const api = useContext(APIContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if there's already a lesson for today
    setIsLoading(true);

    api.getTodaysLesson(
      (data) => {
        setIsLoading(false);
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
    setIsGenerating(true);
    setError(null);

    api.generateDailyLesson(
      (data) => {
        setIsGenerating(false);
        console.log("Generated new lesson:", data);
        setLessonData(data);
        // Auto-play the audio when it's ready
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }, 100);
      },
      (error) => {
        setIsGenerating(false);
        console.error("Error generating lesson:", error);
        setError(error.message || "Failed to generate daily lesson. Please try again.");
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
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: zeeguuOrange, marginBottom: "20px" }}>Today's Audio Lesson</h2>
        <LoadingAnimation>
          <p>Checking for existing lesson...</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: zeeguuOrange, marginBottom: "20px" }}>Today's Audio Lesson</h2>
        <LoadingAnimation reportIssueDelay={40000}>
          <p>Generating your daily lesson... This may take up to 30 seconds.</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (!lessonData && !error) {
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
        <h2 style={{ color: zeeguuOrange, marginBottom: "20px" }}>Today's Audio Lesson</h2>
        <p style={{ marginBottom: "20px", textAlign: "center", maxWidth: "500px" }}>
          Generate your personalized audio lesson for today. The lesson will be tailored to your learning level and
          interests.
        </p>
        <OrangeButton onClick={handleGenerateLesson}>Generate Daily Lesson</OrangeButton>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: zeeguuOrange, marginBottom: "20px" }}>Today's Audio Lesson</h2>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div>
        <p style={{ marginBottom: "20px" }}>
          Here's your daily lesson! Listen to improve your comprehension skills.
        </p>

        {lessonData.duration_seconds && (
          <p style={{ marginBottom: "10px", color: "gray" }}>
            Duration: {Math.floor(lessonData.duration_seconds / 60)}:
            {(lessonData.duration_seconds % 60).toString().padStart(2, "0")}
          </p>
        )}

        {lessonData.created_at && (
          <p style={{ marginBottom: "10px", color: "gray" }}>
            Created: {new Date(lessonData.created_at).toLocaleDateString()}
          </p>
        )}

        <audio
          ref={audioRef}
          controls
          style={{ 
            width: "100%", 
            marginBottom: "20px"
          }}
          onError={() => {
            console.log("Audio failed to load, trying direct fetch...");
            // If direct URL fails, try fetching as blob
            fetch(lessonData.audio_url)
              .then((response) => response.blob())
              .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                if (audioRef.current) {
                  audioRef.current.src = blobUrl;
                }
              })
              .catch((err) => console.error("Failed to fetch audio as blob:", err));
          }}
        >
          <source src={lessonData.audio_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

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
              textDecoration: "underline"
            }}
          >
            {isDeleting ? "deleting..." : "delete lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
