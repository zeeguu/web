import React, { useContext, useEffect, useRef, useState } from "react";
import { orange500, orange600, orange800, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import FeedbackModal from "../components/FeedbackModal";
import { FEEDBACK_OPTIONS, FEEDBACK_CODES_NAME, FEEDBACK_CODES } from "../components/FeedbackConstants";
import Word from "../words/Word";

const TWO_MIN = 120000; // 2 minutes in milliseconds
const SESSION_UPDATE_INTERVAL = 10000; // Update session every 10 seconds

export function wordsAsTile(words) {
  if (!words || !words.length) return "";

  const comma_separated_words = words.map((word) => word.origin || word).join(", ");
  const capitalized_comma_separated_words =
    comma_separated_words.charAt(0).toUpperCase() + comma_separated_words.slice(1);
  return capitalized_comma_separated_words;
}

export default function TodayAudio() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
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
  const [openFeedback, setOpenFeedback] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);
  const [canGenerateLesson, setCanGenerateLesson] = useState(null); // null = checking, true = can generate, false = cannot

  // Listening session tracking
  const listeningSessionIdRef = useRef(null);
  const listeningStartTimeRef = useRef(null);
  const sessionUpdateTimerRef = useRef(null);

  let words = lessonData?.words || [];

  // Clean up listening session on unmount
  useEffect(() => {
    return () => {
      if (sessionUpdateTimerRef.current) {
        clearInterval(sessionUpdateTimerRef.current);
      }
      // End any active session when component unmounts
      if (listeningSessionIdRef.current && listeningStartTimeRef.current) {
        const elapsedSeconds = Math.floor((Date.now() - listeningStartTimeRef.current) / 1000);
        api.listeningSessionEnd(listeningSessionIdRef.current, elapsedSeconds);
      }
    };
  }, [api]);

  const startListeningSession = () => {
    if (!lessonData?.lesson_id) return;

    api.listeningSessionCreate(lessonData.lesson_id, (sessionId) => {
      console.log('Started listening session:', sessionId);
      listeningSessionIdRef.current = sessionId;
      listeningStartTimeRef.current = Date.now();

      // Set up periodic session updates
      sessionUpdateTimerRef.current = setInterval(() => {
        if (listeningSessionIdRef.current && listeningStartTimeRef.current) {
          const elapsedSeconds = Math.floor((Date.now() - listeningStartTimeRef.current) / 1000);
          api.listeningSessionUpdate(listeningSessionIdRef.current, elapsedSeconds);
        }
      }, SESSION_UPDATE_INTERVAL);
    });
  };

  const endListeningSession = () => {
    // Clear the update timer
    if (sessionUpdateTimerRef.current) {
      clearInterval(sessionUpdateTimerRef.current);
      sessionUpdateTimerRef.current = null;
    }

    // End the session with final duration
    if (listeningSessionIdRef.current && listeningStartTimeRef.current) {
      const elapsedSeconds = Math.floor((Date.now() - listeningStartTimeRef.current) / 1000);
      console.log('Ending listening session:', listeningSessionIdRef.current, 'duration:', elapsedSeconds, 'seconds');
      api.listeningSessionEnd(listeningSessionIdRef.current, elapsedSeconds);
      listeningSessionIdRef.current = null;
      listeningStartTimeRef.current = null;
    }
  };

  // Update page title and playback time when lessonData changes
  useEffect(() => {
    if (lessonData && lessonData.words) {
      document.title = `[${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}] Daily Audio: ${wordsAsTile(words)}`;
      
      // Initialize playback time from lesson data
      const initialTime = lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0;
      console.log('Setting initial playback time:', initialTime);
      setCurrentPlaybackTime(initialTime);
    } else {
      document.title = "Zeeguu: Audio Lesson";
    }
  }, [lessonData]);

  // Check if lesson generation is possible
  const checkLessonGenerationFeasibility = () => {
    api.checkDailyLessonFeasibility(
      (data) => {
        setCanGenerateLesson(data.feasible);
        if (!data.feasible) {
          setError(data.message || "Not enough words available to generate a lesson.");
        }
      },
      (error) => {
        // If the API endpoint doesn't exist, we'll assume generation is possible
        // and let the generation attempt handle the error
        setCanGenerateLesson(true);
      }
    );
  };

  // Fetch lesson data on mount
  useEffect(() => {
    // Check if there's already a lesson for today
    setIsLoading(true);

    api.getTodaysLesson(
      (data) => {
        setIsLoading(false);
        setLessonData(data); // data will be null if no lesson exists, or lesson object if it exists
        
        // If no lesson exists, check if we can generate one
        if (!data) {
          checkLessonGenerationFeasibility();
        }
      },
      (error) => {
        setIsLoading(false);
        setError(error.message);
        setLessonData(null);
        
        // Even on error, check if generation is possible
        checkLessonGenerationFeasibility();
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
        setLessonData(data);
      },
      (error) => {
        // Clear the localStorage flag on error
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);

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
          <p>Generating your daily lesson... This may take a few minutes so feel free to go away and come back later</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (!lessonData) {
    // Still checking if generation is possible
    if (canGenerateLesson === null) {
      return (
        <div style={{ padding: "20px" }}>
          <LoadingAnimation>
            <p>Checking if audio lesson generation is possible...</p>
          </LoadingAnimation>
        </div>
      );
    }

    // Cannot generate lesson - show error immediately
    if (canGenerateLesson === false) {
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
          <p style={{ textAlign: "center", maxWidth: "500px", color: "#666", fontSize: "16px", lineHeight: "1.6" }}>
            You need more words in your learning vocabulary to generate an audio lesson. Try reading more articles and translating more words first.
          </p>
        </div>
      );
    }

    // Can generate lesson - show the generate button
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
        <p style={{ marginBottom: "20px", textAlign: "center", maxWidth: "500px" }}>
          Push the button for... an audio lesson for you based on the words you are currently learning.
        </p>
      </div>
    );
  }


  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: zeeguuOrange, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
        {lessonData.is_completed && <span style={{ color: "#28a745", fontSize: "20px" }}>✓</span>}
        {wordsAsTile(words)}
      </h2>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div>
        {!lessonData.is_completed && (
          <p style={{ marginBottom: "20px" }}>Here's your daily lesson! Listen to improve your comprehension skills.</p>
        )}

        <CustomAudioPlayer
          src={lessonData.audio_url}
          initialProgress={
            lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0
          }
          language={userDetails?.learned_language}
          title={lessonData.words ? wordsAsTile(lessonData.words) : "Daily Audio Lesson"}
          artist="Zeeguu Daily Lesson"
          onPlay={() => {
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "resume");
              // Start a new listening session
              startListeningSession();
            }
          }}
          onPause={() => {
            // End listening session when paused
            endListeningSession();
          }}
          onProgressUpdate={(progressSeconds) => {
            console.log('Updating playback time:', progressSeconds);
            setCurrentPlaybackTime(progressSeconds);
            if (lessonData.lesson_id) {
              // Use pause action to save progress position
              api.updateLessonState(lessonData.lesson_id, "pause", progressSeconds);
            }
          }}
          onEnded={() => {
            // End listening session when audio ends
            endListeningSession();
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
            // If direct URL fails, try fetching as blob
            fetch(lessonData.audio_url)
              .then((response) => response.blob())
              .then((blob) => {
                const blobUrl = URL.createObjectURL(blob);
                // Note: Custom player will need to handle blob URLs
              })
              .catch((err) => {});
          }}
          style={{
            width: "100%",
            marginBottom: "20px",
            maxWidth: "600px",
            margin: "0 auto 20px auto",
          }}
        />

        {lessonData.is_completed && (
          <div
            style={{
              marginBottom: "20px",
              marginTop: "20px",
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

        {/* Display word details with type badges */}
        {words && words.length > 0 && (
          <div style={{ marginTop: "30px", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "#333" }}>
              Words in this lesson
            </h3>
            {words.map((word, index) => (
              <Word
                key={index}
                bookmark={word}
                disableEdit={true}
                compact={true}
                showRanking={false}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={() => setOpenFeedback(true)}
            style={{
              backgroundColor: "transparent",
              color: "#999",
              border: "none",
              borderRadius: "0",
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Feedback
          </button>
        </div>

        <FeedbackModal
          prefixMsg={lessonData ? 
            (() => {
              const prefixMsg = `Daily Audio Lesson - Playback time: ${Math.floor(currentPlaybackTime / 60)}:${(currentPlaybackTime % 60).toFixed(0).padStart(2, '0')} | Lesson ID: ${lessonData.lesson_id} | Words: ${wordsAsTile(lessonData.words)} | Date: ${new Date(lessonData.created_at || Date.now()).toLocaleDateString()}`;
              console.log('Feedback prefix message:', prefixMsg);
              return prefixMsg;
            })()
            : "Daily Audio Lesson Feedback"
          }
          open={openFeedback}
          setOpen={setOpenFeedback}
          componentCategories={FEEDBACK_OPTIONS.ALL}
          preselectedCategory={FEEDBACK_CODES_NAME.DAILY_AUDIO}
        />
      </div>
    </div>
  );
}
