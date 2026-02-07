import React, { useContext, useEffect, useState } from "react";
import { orange500, orange600, orange800, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import FeedbackModal from "../components/FeedbackModal";
import { FEEDBACK_OPTIONS, FEEDBACK_CODES_NAME, FEEDBACK_CODES } from "../components/FeedbackConstants";
import Word from "../words/Word";
import useListeningSession from "../hooks/useListeningSession";


export function wordsAsTile(words) {
  if (!words || !words.length) return "";

  const comma_separated_words = words.map((word) => word.origin || word).join(", ");
  const capitalized_comma_separated_words =
    comma_separated_words.charAt(0).toUpperCase() + comma_separated_words.slice(1);
  return capitalized_comma_separated_words;
}

export default function TodayAudio({ setShowTabs }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);

  // Poll for progress when generating
  useEffect(() => {
    const generatingKey = `zeeguu_generating_lesson_${new Date().toDateString()}`;
    const hasLocalStorageFlag = localStorage.getItem(generatingKey);

    // Start polling if either: localStorage flag is set (page reload) or isGenerating is true (button click/409)
    const shouldPoll = hasLocalStorageFlag || isGenerating;
    if (!shouldPoll) {
      return;
    }

    // Ensure UI shows generating state (for page reload case where isGenerating starts false)
    if (hasLocalStorageFlag && !isGenerating) {
      setIsGenerating(true);
      return; // Effect will re-run with isGenerating=true
    }

    // Helper to stop polling and reset state
    let pollInterval;

    const stopPolling = () => {
      clearInterval(pollInterval);
      localStorage.removeItem(generatingKey);
      setIsGenerating(false);
      setGenerationProgress(null);
    };

    let lessonRetryCount = 0;
    const MAX_LESSON_RETRIES = 3;

    const handleLessonReady = (data) => {
      if (data && data.lesson_id) {
        stopPolling();
        setLessonData(data);
        // Update context to show lesson is ready
        setUserDetails((prev) => ({ ...prev, daily_audio_status: data.is_completed ? "completed" : "ready" }));
        lessonRetryCount = 0;
      } else if (data && data.error) {
        // Lesson exists but has an error (e.g., audio file not ready yet)
        lessonRetryCount++;
        if (lessonRetryCount >= MAX_LESSON_RETRIES) {
          handleError(data.error);
        }
        // Otherwise, keep polling - the file might still be writing
      }
    };

    const handleError = (message) => {
      stopPolling();
      setError(message);
    };

    // Check if lesson is ready (used in multiple places)
    const checkForLesson = () => {
      api.getTodaysLesson(handleLessonReady, () => {});
    };

    // Poll for generation progress
    pollInterval = setInterval(() => {
      api.getAudioLessonGenerationProgress(
        (progress) => {
          if (progress) {
            setGenerationProgress(progress);

            if (progress.status === "done") {
              checkForLesson();
            } else if (progress.status === "error") {
              handleError(progress.message || "Lesson generation failed. Please try again.");
            }
          } else {
            // No progress record - check if lesson is ready, otherwise stop polling
            api.getTodaysLesson(
              (data) => {
                if (data && data.lesson_id) {
                  handleLessonReady(data);
                } else {
                  // No progress AND no lesson - generation must have failed silently
                  stopPolling();
                  // Let user try again by checking feasibility
                  checkLessonGenerationFeasibility();
                }
              },
              () => {
                // API error - stop polling and let user retry
                stopPolling();
                checkLessonGenerationFeasibility();
              },
            );
          }
        },
        // On progress API error, fall back to checking lesson directly
        checkForLesson,
      );
    }, 1500);

    // Cleanup on unmount
    return stopPolling;
  }, [api, isGenerating]);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [lessonData, setLessonData] = useState(null);
  const [error, setError] = useState(null);
  const [canGenerateLesson, setCanGenerateLesson] = useState(null); // null = checking, true = can generate, false = cannot

  // Listening session tracking via hook
  const listeningSession = useListeningSession(lessonData?.lesson_id);

  let words = lessonData?.words || [];

  // Control tab visibility - hide tabs when showing empty state
  useEffect(() => {
    if (setShowTabs) {
      // Hide tabs only when we know user can't generate a lesson and has no lesson
      const shouldHideTabs = canGenerateLesson === false && !lessonData;
      setShowTabs(!shouldHideTabs);
    }
  }, [canGenerateLesson, lessonData, setShowTabs]);

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
          // Reset status to available since generation isn't possible
          setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));
        }
      },
      (error) => {
        // If the API endpoint doesn't exist, we'll assume generation is possible
        // and let the generation attempt handle the error
        setCanGenerateLesson(true);
      }
    );
  };

  // Fetch lesson data on mount - but check for active generation first
  useEffect(() => {
    setIsLoading(true);

    // First, check if there's an active generation in progress
    api.getAudioLessonGenerationProgress(
      (progress) => {
        if (progress && !["done", "error"].includes(progress.status)) {
          // Generation in progress - let polling handle it
          setIsLoading(false);
          setIsGenerating(true);
          setGenerationProgress(progress);
          // Update context so navigation dot shows generating state
          setUserDetails((prev) => ({ ...prev, daily_audio_status: "generating" }));
          return;
        }

        // No active generation - check for existing lesson
        api.getTodaysLesson(
          (data) => {
            setIsLoading(false);
            setLessonData(data);

            // If no lesson exists, check if we can generate one
            if (!data) {
              checkLessonGenerationFeasibility();
            }
          },
          (error) => {
            setIsLoading(false);
            setError(error.message);
            setLessonData(null);
            // Reset status on error
            setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));

            // Even on error, check if generation is possible
            checkLessonGenerationFeasibility();
          },
        );
      },
      () => {
        // Progress API error - fall back to checking lesson
        api.getTodaysLesson(
          (data) => {
            setIsLoading(false);
            setLessonData(data);
            if (!data) {
              checkLessonGenerationFeasibility();
            }
          },
          (error) => {
            setIsLoading(false);
            setError(error.message);
            setLessonData(null);
            // Reset status on error
            setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));
            checkLessonGenerationFeasibility();
          },
        );
      },
    );
  }, [api]);

  const handleGenerateLesson = () => {
    const generatingKey = `zeeguu_generating_lesson_${new Date().toDateString()}`;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(null);

    // Update context so navigation dot shows generating state
    setUserDetails((prev) => ({ ...prev, daily_audio_status: "generating" }));

    // Set localStorage flag to track generation across page reloads
    localStorage.setItem(generatingKey, "true");

    api.generateDailyLesson(
      (data) => {
        // Clear the localStorage flag when generation completes
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);
        setGenerationProgress(null);
        setLessonData(data);
        // Update context to reflect lesson is ready
        setUserDetails((prev) => ({ ...prev, daily_audio_status: "ready" }));
      },
      (error) => {
        // Check if generation is already in progress (409 Conflict)
        if (error.message && error.message.toLowerCase().includes("already being generated")) {
          // Don't clear the flag - keep polling for the existing generation
          return;
        }

        // Clear the localStorage flag on error
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);
        setGenerationProgress(null);

        // Reset status back to available on error
        setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));

        // Check if the error is related to no words in learning
        if (error.message && error.message.toLowerCase().includes("not enough words")) {
          setError(
            "Not enough words in learning to generate a lesson. Need at least 2 words that were not in audio lessons before",
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
    // Build progress message
    let progressMessage = "Generating your daily lesson...";
    let progressPercent = 0;

    if (generationProgress) {
      // Use message from backend, with simple fallback
      progressMessage = generationProgress.message || "Processing...";

      // Calculate progress percentage
      if (generationProgress.total_words > 0) {
        const wordsCompleted = Math.max(0, generationProgress.current_word - 1);
        let stepsInCurrentWord = 0;
        if (generationProgress.total_steps > 0) {
          stepsInCurrentWord = generationProgress.current_step / generationProgress.total_steps;
        }
        progressPercent = ((wordsCompleted + stepsInCurrentWord) / generationProgress.total_words) * 100;
      }
    }

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
          <p style={{ marginBottom: "15px" }}>{progressMessage}</p>
          {generationProgress && progressPercent > 0 && (
            <div
              style={{
                width: "200px",
                height: "8px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: `${Math.min(progressPercent, 100)}%`,
                  height: "100%",
                  backgroundColor: orange500,
                  borderRadius: "4px",
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </div>
          )}
          <p style={{ fontSize: "12px", color: "#666" }}>
            Feel free to go away and come back later
          </p>
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
        <EmptyState
          message="You need more words in your learning vocabulary to generate an audio lesson. Try reading more articles and translating words first."
        />
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
        {error && (
          <FullWidthErrorMsg style={{ marginBottom: "20px", maxWidth: "500px" }}>
            {error}
          </FullWidthErrorMsg>
        )}
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
              // Start or resume listening session
              listeningSession.start();
              // Update context so navigation dot disappears (in_progress)
              setUserDetails((prev) => ({ ...prev, daily_audio_status: "in_progress" }));
            }
          }}
          onPause={() => {
            // Pause listening session (accumulates time, doesn't end)
            listeningSession.pause();
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
            listeningSession.end();
            if (lessonData.lesson_id) {
              api.updateLessonState(lessonData.lesson_id, "complete", null, () => {
                // Update local state to show completion immediately
                setLessonData((prev) => ({
                  ...prev,
                  is_completed: true,
                  completed_at: new Date().toISOString(),
                }));
                // Update context so navigation dot disappears
                setUserDetails((prev) => ({ ...prev, daily_audio_status: "completed" }));
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
