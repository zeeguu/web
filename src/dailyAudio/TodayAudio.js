import React, { useContext, useEffect, useState } from "react";
import { orange500, orange600, orange800, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import FeedbackModal from "../components/FeedbackModal";
import { FEEDBACK_OPTIONS, FEEDBACK_CODES_NAME } from "../components/FeedbackConstants";
import Word from "../words/Word";
import useListeningSession from "../hooks/useListeningSession";
import { AUDIO_STATUS, GENERATION_PROGRESS } from "./AudioLessonConstants";


export function wordsAsTile(words) {
  if (!words || !words.length) return "";

  const comma_separated_words = words.map((word) => word.origin || word).join(", ");
  const capitalized_comma_separated_words =
    comma_separated_words.charAt(0).toUpperCase() + comma_separated_words.slice(1);
  return capitalized_comma_separated_words;
}

const TOPIC_STORAGE_KEY_PREFIX = "zeeguu_lesson_topic_";

export default function TodayAudio({ setShowTabs }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const lang = userDetails?.learned_language || "";
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [topicSuggestion, setTopicSuggestion] = useState(
    () => localStorage.getItem(TOPIC_STORAGE_KEY_PREFIX + lang) || "",
  );

  // Poll for progress when generating
  useEffect(() => {
    const generatingKey = `zeeguu_generating_lesson_${lang}_${new Date().toDateString()}`;
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
    let noProgressCount = 0;
    const MAX_NO_PROGRESS_RETRIES = 5;

    const handleLessonReady = (data) => {
      if (data && data.lesson_id) {
        stopPolling();
        setLessonData(data);
        // Update context to show lesson is ready
        setUserDetails((prev) => ({ ...prev, daily_audio_status: data.is_completed ? AUDIO_STATUS.COMPLETED : AUDIO_STATUS.READY }));
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
            noProgressCount = 0;
            setGenerationProgress(progress);

            if (progress.status === GENERATION_PROGRESS.DONE) {
              checkForLesson();
            } else if (progress.status === GENERATION_PROGRESS.ERROR) {
              handleError(progress.message || "Lesson generation failed. Please try again.");
            }
          } else {
            // No progress record - might be a brief gap (e.g., lesson was
            // regenerated and progress hasn't appeared yet). Retry a few
            // times before giving up.
            noProgressCount++;
            if (noProgressCount <= MAX_NO_PROGRESS_RETRIES) {
              return; // keep polling
            }
            // Exhausted retries — check if a lesson appeared, otherwise stop
            api.getTodaysLesson(
              (data) => {
                if (data && data.lesson_id) {
                  handleLessonReady(data);
                } else {
                  stopPolling();
                  checkLessonGenerationFeasibility();
                }
              },
              () => {
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
      const topicPrefix = lessonData.topic_suggestion ? `${lessonData.topic_suggestion}: ` : "";
      document.title = `[${new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}] Daily Audio: ${topicPrefix}${wordsAsTile(words)}`;
      
      // Initialize playback time from lesson data
      const initialTime = lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0;
      setCurrentPlaybackTime(initialTime);
    } else {
      document.title = "Zeeguu: Audio Lesson";
    }
  }, [lessonData]);

  const failedKey = `zeeguu_generation_failed_${lang}_${new Date().toDateString()}`;

  // Check if lesson generation is possible
  const checkLessonGenerationFeasibility = () => {
    // If generation already failed this session, don't retry on refresh
    const previousError = localStorage.getItem(failedKey);
    if (previousError) {
      setCanGenerateLesson(false);
      setError(previousError);
      return;
    }

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
        if (progress && ![GENERATION_PROGRESS.DONE, GENERATION_PROGRESS.ERROR].includes(progress.status)) {
          // Generation in progress - let polling handle it
          setIsLoading(false);
          setIsGenerating(true);
          setGenerationProgress(progress);
          // Update context so navigation dot shows generating state
          setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.GENERATING }));
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
            setLessonData(null);
            // Reset status on error
            setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));

            // Don't show technical errors (e.g., "Audio file not found") — just let user regenerate
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
    const generatingKey = `zeeguu_generating_lesson_${lang}_${new Date().toDateString()}`;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(null);

    // Update context so navigation dot shows generating state
    setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.GENERATING }));

    // Set localStorage flag to track generation across page reloads
    localStorage.setItem(generatingKey, "true");

    const trimmedTopic = topicSuggestion.trim() || null;
    api.generateDailyLesson(
      (data) => {
        if (data.status === AUDIO_STATUS.GENERATING) {
          // Generation started in background — polling will deliver the lesson
          return;
        }
        // Existing lesson returned directly
        localStorage.removeItem(generatingKey);
        localStorage.removeItem(failedKey);
        setIsGenerating(false);
        setGenerationProgress(null);
        setLessonData(data);
        setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.READY }));
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

        setCanGenerateLesson(false);

        // Check if the error is related to no words in learning
        let errorMsg;
        if (error.message && error.message.toLowerCase().includes("not enough words")) {
          errorMsg = "Not enough words in learning to generate a lesson. Need at least 2 words that were not in audio lessons before";
          // Only cache permanent errors — not transient network failures
          localStorage.setItem(failedKey, errorMsg);
        } else {
          errorMsg = error.message || "Failed to generate daily lesson. Please try again.";
        }
        setError(errorMsg);
      },
      trimmedTopic,
    );
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Preparing your daily lesson...</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (isGenerating) {
    // Build progress detail (e.g., "Word 2/3: Synthesizing man voice")
    let progressDetail = "Starting...";
    let progressPercent = 1; // Start at 1% so the bar is visible immediately

    if (generationProgress) {
      progressDetail = generationProgress.message || "Processing...";

      // Calculate progress percentage (minimum 1%)
      if (generationProgress.total_words > 0) {
        const wordsCompleted = Math.max(0, generationProgress.current_word - 1);
        let stepsInCurrentWord = 0;
        if (generationProgress.total_steps > 0) {
          stepsInCurrentWord = generationProgress.current_step / generationProgress.total_steps;
        }
        progressPercent = Math.max(1, ((wordsCompleted + stepsInCurrentWord) / generationProgress.total_words) * 100);
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
        <h2 style={{ color: zeeguuOrange, marginBottom: "10px" }}>
          Generating your daily lesson...
        </h2>
        <p style={{ color: "var(--text-primary)", marginBottom: "20px", fontSize: "16px", textAlign: "center" }}>
          This can take a while.<br />
          Feel free to browse — you'll find it here when it's ready.
        </p>
        <div
          style={{
            width: "200px",
            height: "8px",
            backgroundColor: "var(--border-light)",
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
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-faint)" }}>{progressDetail}</p>
      </div>
    );
  }

  if (!lessonData) {
    // Cannot generate lesson
    if (canGenerateLesson === false) {
      return (
        <EmptyState
          message={error || "You need more words in your learning vocabulary to generate an audio lesson. Try reading more articles and translating words first."}
        />
      );
    }

    // Can generate lesson - show the generate button
    if (canGenerateLesson === true) {
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
            Generate a personalized audio lesson based on the words you're learning.
          </p>
          <input
            type="text"
            placeholder="Topic (optional), e.g. app usability"
            maxLength={24}
            value={topicSuggestion}
            onChange={(e) => {
              const val = e.target.value;
              setTopicSuggestion(val);
              if (val.trim()) {
                localStorage.setItem(TOPIC_STORAGE_KEY_PREFIX + lang, val);
              } else {
                localStorage.removeItem(TOPIC_STORAGE_KEY_PREFIX + lang);
              }
            }}
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "8px 12px",
              border: "1px solid var(--border-light)",
              borderRadius: "4px",
              fontSize: "14px",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-secondary)",
              textAlign: "center",
            }}
          />
        </div>
      );
    }

    // Still checking feasibility
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Checking...</p>
        </LoadingAnimation>
      </div>
    );
  }


  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: zeeguuOrange, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
        {lessonData.is_completed && <span style={{ color: "#28a745", fontSize: "20px" }}>✓</span>}
        {lessonData.topic_suggestion
          ? `${lessonData.topic_suggestion}: ${wordsAsTile(words)}`
          : wordsAsTile(words)}
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
              setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.IN_PROGRESS }));
            }
          }}
          onPause={() => {
            // Pause listening session (accumulates time, doesn't end)
            listeningSession.pause();
          }}
          onProgressUpdate={(progressSeconds) => {
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
                setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.COMPLETED }));
              });
            }
          }}
          onError={() => {}}
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
              backgroundColor: "var(--bg-secondary)",
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
            <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px", color: "var(--text-primary)" }}>
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
              color: "var(--text-faint)",
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
          prefixMsg={lessonData
            ? `Daily Audio Lesson - Playback time: ${Math.floor(currentPlaybackTime / 60)}:${(currentPlaybackTime % 60).toFixed(0).padStart(2, '0')} | Lesson ID: ${lessonData.lesson_id} | Words: ${wordsAsTile(lessonData.words)} | Date: ${new Date(lessonData.created_at || Date.now()).toLocaleDateString()}`
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
