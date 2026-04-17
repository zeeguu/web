import React, { useContext, useEffect, useState } from "react";
import { orange500, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyState from "../components/EmptyState";
import FullWidthErrorMsg from "../components/FullWidthErrorMsg.sc";
import useListeningSession from "../hooks/useListeningSession";
import { AUDIO_STATUS, GENERATION_PROGRESS } from "./AudioLessonConstants";
import { GenerateView, GenerateButton } from "./GenerateButton.sc";
import SuggestionSelector, { getSavedSuggestion, getSavedSuggestionType, suggestionKey } from "./SuggestionSelector";
import LessonPlaybackView from "./LessonPlaybackView";
import { wordsAsTile, shortDate } from "./audioUtils";

export default function TodayAudio({ setShowTabs }) {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const lang = userDetails?.learned_language || "";
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [suggestionType, setSuggestionType] = useState(
    () => getSavedSuggestionType(lang),
  );
  const [suggestion, setSuggestion] = useState(() => {
    return getSavedSuggestion(lang);
  });

  // Re-initialize state when language changes
  useEffect(() => {
    setSuggestionType(getSavedSuggestionType(lang));
    setSuggestion(getSavedSuggestion(lang));
    setLessonData(null);
    setError(null);
    setCanGenerateLesson(null);
  }, [lang]);

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

    const pollForProgress = () => {
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
    };

    // Poll for generation progress
    pollInterval = setInterval(pollForProgress, 1500);

    // Browsers throttle setInterval for background tabs, so check
    // immediately when the user returns to the app
    const onVisibilityChange = () => {
      if (!document.hidden) {
        pollForProgress();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Cleanup on unmount
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
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
      setShowTabs(true);
    }
  }, [canGenerateLesson, lessonData, setShowTabs]);

  // Update page title and playback time when lessonData changes
  useEffect(() => {
    if (lessonData && lessonData.words) {
      document.title = shortDate() + " Daily Audio: " + wordsAsTile(words);
      
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
          setError("Not enough words for a vocabulary lesson. Try a Topic or Situation instead!");
          // If user had auto selected, switch to topic
          if (suggestionType === "auto") {
            setSuggestionType("topic");
          }
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
  }, [api, lang]);

  const handleGenerateLesson = () => {
    const generatingKey = `zeeguu_generating_lesson_${lang}_${new Date().toDateString()}`;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(null);

    // Update context so navigation dot shows generating state
    setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.GENERATING }));

    // Set localStorage flag to track generation across page reloads
    localStorage.setItem(generatingKey, "true");

    const trimmedSuggestion = suggestion.trim() || null;
    const suggestionTypeToSend = trimmedSuggestion && suggestionType !== "auto" ? suggestionType : null;
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

        // Check if the error is a topic rejection (user can try a different topic)
        const isSuggestionRejection = error.message && error.message.toLowerCase().includes("can't generate a lesson for this");
        if (isSuggestionRejection) {
          setError(error.message);
          return;
        }

        setCanGenerateLesson(false);

        // Check if the error is related to no words in learning
        let errorMsg;
        if (error.message && error.message.toLowerCase().includes("not enough words")) {
          errorMsg = "Not enough words for a vocabulary lesson. Try a Topic or Situation instead!";
        } else {
          errorMsg = error.message || "Failed to generate daily lesson. Please try again.";
        }
        setError(errorMsg);
      },
      trimmedSuggestion,
      suggestionTypeToSend,
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
      if (generationProgress.total_segments > 0) {
        const segmentsCompleted = Math.max(0, generationProgress.current_segment - 1);
        let stepsInCurrentSegment = 0;
        if (generationProgress.total_steps > 0) {
          stepsInCurrentSegment = generationProgress.current_step / generationProgress.total_steps;
        }
        progressPercent = Math.max(1, ((segmentsCompleted + stepsInCurrentSegment) / generationProgress.total_segments) * 100);
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


        <div
          style={{
            width: "200px",
            height: "8px",
            backgroundColor: "var(--border-light)",
            borderRadius: "4px",
            overflow: "hidden",
            marginBottom: "10px",
            marginTop: "10px",
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

        <p style={{ color: "var(--text-primary)", marginBottom: "20px", fontSize: "16px", textAlign: "center" }}>
          This can take a while.<br />
          Feel free to browse — you'll find it here when it's ready.
        </p>

      </div>
    );
  }

  if (!lessonData) {
    if (canGenerateLesson !== null) {
      const autoDisabled = canGenerateLesson === false;
      const showError = error && suggestionType === "auto";
      const canGenerate = suggestionType !== "auto" || !autoDisabled;
      return (
        <GenerateView>
          <SuggestionSelector
            suggestionType={suggestionType}
            setSuggestionType={setSuggestionType}
            suggestion={suggestion}
            setSuggestion={setSuggestion}
            lang={lang}
            autoDisabled={autoDisabled}
          />
          {canGenerate ? (
            <GenerateButton onClick={handleGenerateLesson}>
              Generate
              <br />
              Lesson
            </GenerateButton>
          ) : (
            <p style={{ color: "var(--text-secondary)", textAlign: "center", maxWidth: "300px", marginTop: "20px" }}>
              {error || "Not enough words for a vocabulary lesson. Try a Topic or Situation instead!"}
            </p>
          )}
        </GenerateView>
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
    <LessonPlaybackView
      lessonData={lessonData}
      setLessonData={setLessonData}
      words={words}
      error={error}
      api={api}
      userDetails={userDetails}
      setUserDetails={setUserDetails}
      listeningSession={listeningSession}
      currentPlaybackTime={currentPlaybackTime}
      setCurrentPlaybackTime={setCurrentPlaybackTime}
    />
  );
}
