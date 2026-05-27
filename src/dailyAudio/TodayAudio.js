import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { orange500, zeeguuOrange } from "../components/colors";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import LoadingAnimation from "../components/LoadingAnimation";
import useListeningSession from "../hooks/useListeningSession";
import useDailyLessonPreference from "../hooks/useDailyLessonPreference";
import { AUDIO_STATUS, GENERATION_PROGRESS } from "./AudioLessonConstants";
import TodayEpisodeCard from "./TodayEpisodeCard";
import DailyLessonSettingsDialog from "./DailyLessonSettingsDialog";
import { SubtleTextButton } from "./LessonView.sc";
import { BannerButton } from "./SharedLessonView.sc";
import { wordsAsTile, shortDate } from "./audioUtils";

// Shown rotating during the backend phases that don't emit sub-step
// progress (no record yet, "pending", "generating_script",
// "combining_audio"). Only "synthesizing_audio" has a moving
// step counter, so during that phase we surface the backend message
// verbatim instead.
const PLACEHOLDER_PROGRESS_MESSAGES = [
  "Warming up...",
  "Picking content for today's lesson...",
  "Drafting the dialogue...",
  "Picking interesting vocabulary...",
  "Crafting natural conversation...",
  "Adapting for your level...",
];
const PLACEHOLDER_ROTATION_MS = 2500;

export default function TodayAudio() {
  const api = useContext(APIContext);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const lang = userDetails?.learned_language || "";

  const { dailyType, dailySuggestion, prefLoaded, isConfigured, saveDailyLesson } =
    useDailyLessonPreference(api, lang);

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  // What the in-progress generation is about, so the progress screen can name
  // it. { type: backendLessonType, suggestion }
  const [generatingLabel, setGeneratingLabel] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [noLesson, setNoLesson] = useState(false); // confirmed: nothing for today yet
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const history = useHistory();

  // Guards against re-triggering auto-generation every render once we've
  // already kicked it off (or are explicitly driving generation ourselves).
  const autoGenAttemptedRef = useRef(false);

  const generatingKey = `zeeguu_generating_lesson_${lang}_${new Date().toDateString()}`;
  const failedKey = `zeeguu_generation_failed_${lang}_${new Date().toDateString()}`;

  // Listening session tracking via hook
  const listeningSession = useListeningSession(lessonData?.lesson_id);
  const words = lessonData?.words || [];

  // Re-initialize when the learned language changes
  useEffect(() => {
    setLessonData(null);
    setError(null);
    setNoLesson(false);
    // Tear down any in-flight generation/polling tied to the previous language
    // (the poll effect keys its localStorage flag on the old lang and doesn't
    // depend on lang, so without this it keeps polling for the wrong language).
    setIsGenerating(false);
    setGenerationProgress(null);
    autoGenAttemptedRef.current = false;
  }, [lang]);

  // Kick off generation for a given (backend lesson type, raw subject). Used by
  // the auto-generate fallback and by the settings dialog (first day / change
  // topic). Reuses the existing background-generation + streaming-progress flow.
  function startGeneration(backendType, rawSuggestion) {
    const isVocab = backendType === "three_words_lesson";
    const trimmedSuggestion = isVocab ? null : (rawSuggestion || "").trim() || null;
    const apiLessonType = isVocab ? null : backendType;

    setGeneratingLabel({ type: backendType, suggestion: trimmedSuggestion || "" });
    setIsGenerating(true);
    setNoLesson(false);
    setError(null);
    setGenerationProgress(null);
    setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.GENERATING }));
    localStorage.setItem(generatingKey, "true");

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
        setUserDetails((prev) => ({
          ...prev,
          daily_audio_status: data.is_completed ? AUDIO_STATUS.COMPLETED : AUDIO_STATUS.READY,
        }));
      },
      (err) => {
        // Generation already running — keep the flag and let polling continue
        if (err.message && err.message.toLowerCase().includes("already being generated")) {
          return;
        }
        localStorage.removeItem(generatingKey);
        setIsGenerating(false);
        setGenerationProgress(null);
        setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));

        // "Not enough words" for a vocabulary lesson is actionable — steer to a
        // Topic/Situation (restores the old proactive feasibility guidance,
        // which the auto-generate path otherwise lost).
        let msg;
        if (err.message && err.message.toLowerCase().includes("not enough words")) {
          msg = "Not enough words for a vocabulary lesson yet. Try a Topic or Situation instead.";
        } else {
          msg = err.message || "Couldn't prepare today's lesson. Please try again.";
        }
        // Remember the failure for the rest of the day so we don't auto-retry
        // on every refresh; the user can change the topic to try again.
        localStorage.setItem(failedKey, msg);
        setError(msg);
      },
      trimmedSuggestion,
      apiLessonType,
    );
  }

  // Saving from the settings dialog. regenerate=true applies the change to
  // today's lesson now (delete + regenerate); regenerate=false only stores the
  // preference for tomorrow's lesson.
  function handleConfigured(backendType, suggestion, regenerate) {
    saveDailyLesson(backendType, suggestion);
    setSettingsOpen(false);
    if (!regenerate) return;

    localStorage.removeItem(failedKey);
    setError(null);
    autoGenAttemptedRef.current = true; // we're driving generation explicitly
    if (lessonData) {
      api.deleteTodaysLesson(
        () => {
          setLessonData(null);
          startGeneration(backendType, suggestion);
        },
        // If the delete fails the backend still has today's lesson, so
        // regenerating would silently hand back the old one — surface an error
        // rather than pretend the change applied.
        () => setError("Couldn't refresh today's lesson. Please try again."),
      );
    } else {
      startGeneration(backendType, suggestion);
    }
  }

  // Poll for progress when generating
  useEffect(() => {
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
        setUserDetails((prev) => ({
          ...prev,
          daily_audio_status: data.is_completed ? AUDIO_STATUS.COMPLETED : AUDIO_STATUS.READY,
        }));
        lessonRetryCount = 0;
      } else if (data && data.error) {
        // Lesson exists but has an error (e.g., audio file not ready yet)
        lessonRetryCount++;
        if (lessonRetryCount >= MAX_LESSON_RETRIES) {
          handleError(data.error);
        }
      }
    };

    const handleError = (message) => {
      stopPolling();
      setError(message);
    };

    // Polling found neither a progress record nor a lesson — generation isn't
    // actually running. Stop, mark it attempted (so the auto-gen effect won't
    // relaunch), and show a recoverable error instead of an endless spinner.
    const handleExhausted = () => {
      stopPolling();
      setNoLesson(true);
      autoGenAttemptedRef.current = true;
      setError("We couldn't prepare today's lesson. Try again or pick a different topic.");
    };

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
            // No progress record - might be a brief gap. Retry a few times.
            noProgressCount++;
            if (noProgressCount <= MAX_NO_PROGRESS_RETRIES) {
              return;
            }
            // Exhausted retries — check if a lesson appeared, otherwise stop
            api.getTodaysLesson(
              (data) => {
                if (data && data.lesson_id) {
                  handleLessonReady(data);
                } else {
                  handleExhausted();
                }
              },
              handleExhausted,
            );
          }
        },
        // On progress API error, fall back to checking lesson directly
        checkForLesson,
      );
    };

    pollInterval = setInterval(pollForProgress, 1500);

    // Browsers throttle setInterval for background tabs, so check
    // immediately when the user returns to the app
    const onVisibilityChange = () => {
      if (!document.hidden) {
        pollForProgress();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Capacitor doesn't fire visibilitychange reliably on resume — also
    // listen for the native lifecycle event so the lesson updates the
    // moment the user returns to the app.
    let appStateListenerHandle = null;
    let appStateListenerCancelled = false;
    if (Capacitor.getPlatform() !== "web" && Capacitor.isPluginAvailable("App")) {
      (async () => {
        try {
          const { App } = await import("@capacitor/app");
          const handle = await App.addListener("appStateChange", ({ isActive }) => {
            if (isActive) pollForProgress();
          });
          if (appStateListenerCancelled) handle.remove();
          else appStateListenerHandle = handle;
        } catch {
          // Best-effort — fall back to the interval timer
        }
      })();
    }

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      appStateListenerCancelled = true;
      if (appStateListenerHandle) appStateListenerHandle.remove();
    };
  }, [api, isGenerating]);

  // Rotate placeholder messages only during the early/long phases where the
  // backend message sits static with no sub-step progress.
  const showRealMessage =
    generationProgress?.status === GENERATION_PROGRESS.SYNTHESIZING_AUDIO ||
    generationProgress?.status === GENERATION_PROGRESS.COMBINING_AUDIO ||
    generationProgress?.status === GENERATION_PROGRESS.DONE;
  useEffect(() => {
    if (!isGenerating || showRealMessage) {
      setPlaceholderIndex(0);
      return;
    }
    const id = setInterval(() => {
      setPlaceholderIndex((i) => i + 1);
    }, PLACEHOLDER_ROTATION_MS);
    return () => clearInterval(id);
  }, [isGenerating, showRealMessage]);

  // Update page title and playback time when lessonData changes
  useEffect(() => {
    if (lessonData && lessonData.words) {
      document.title = shortDate() + " Daily Audio: " + wordsAsTile(words);
      const initialTime =
        lessonData.pause_position_seconds || lessonData.position_seconds || lessonData.progress_seconds || 0;
      setCurrentPlaybackTime(initialTime);
    } else {
      document.title = "Zeeguu: Audio Lesson";
    }
  }, [lessonData]);

  // On mount: is something generating? else is there a lesson? else nothing yet.
  useEffect(() => {
    setIsLoading(true);

    const onLesson = (data) => {
      setIsLoading(false);
      if (data) {
        setLessonData(data);
        setNoLesson(false);
      } else {
        setNoLesson(true);
      }
    };
    const onLessonError = () => {
      setIsLoading(false);
      setLessonData(null);
      setUserDetails((prev) => ({ ...prev, daily_audio_status: null }));
      setNoLesson(true);
    };

    api.getAudioLessonGenerationProgress(
      (progress) => {
        if (progress && ![GENERATION_PROGRESS.DONE, GENERATION_PROGRESS.ERROR].includes(progress.status)) {
          setIsLoading(false);
          setIsGenerating(true);
          setGenerationProgress(progress);
          setUserDetails((prev) => ({ ...prev, daily_audio_status: AUDIO_STATUS.GENERATING }));
          return;
        }
        api.getTodaysLesson(onLesson, onLessonError);
      },
      () => api.getTodaysLesson(onLesson, onLessonError),
    );
  }, [api, lang]);

  // No lesson for today yet: if the daily lesson is configured, generate it now
  // (cron miss / first day / timezone). Otherwise the setup CTA is shown.
  useEffect(() => {
    if (!prefLoaded || !noLesson || isGenerating || lessonData) return;
    if (!isConfigured || autoGenAttemptedRef.current) return;
    const previousFailure = localStorage.getItem(failedKey);
    if (previousFailure) {
      setError(previousFailure);
      return;
    }
    autoGenAttemptedRef.current = true;
    startGeneration(dailyType, dailySuggestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefLoaded, noLesson, isGenerating, lessonData, isConfigured, dailyType, dailySuggestion]);

  // Seed the dialog with the saved preference; if none is stored yet (e.g. a
  // lesson generated before preferences existed), fall back to today's lesson
  // so the learner always sees their current type/subject pre-selected.
  const settingsDialog = settingsOpen && (
    <DailyLessonSettingsDialog
      api={api}
      initialType={dailyType || lessonData?.lesson_type || null}
      initialSuggestion={(dailyType ? dailySuggestion : lessonData?.canonical_suggestion) || ""}
      todaysLessonExists={!!lessonData}
      onSubmit={handleConfigured}
      onDismiss={() => setSettingsOpen(false)}
    />
  );

  if (isLoading || !prefLoaded) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Preparing your daily lesson...</p>
        </LoadingAnimation>
      </div>
    );
  }

  if (isGenerating) {
    let progressDetail =
      PLACEHOLDER_PROGRESS_MESSAGES[placeholderIndex % PLACEHOLDER_PROGRESS_MESSAGES.length];
    let progressPercent = 1;

    if (generationProgress?.total_segments > 0) {
      const segmentsCompleted = Math.max(0, generationProgress.current_segment - 1);
      let stepsInCurrentSegment = 0;
      if (generationProgress.total_steps > 0) {
        stepsInCurrentSegment = generationProgress.current_step / generationProgress.total_steps;
      }
      progressPercent = Math.max(
        1,
        ((segmentsCompleted + stepsInCurrentSegment) / generationProgress.total_segments) * 100,
      );
    }

    if (showRealMessage) {
      progressDetail = generationProgress.message || progressDetail;
    }

    const label = generatingLabel || {};
    let subtitle;
    let bigTitle;
    if (label.type === "topic") {
      subtitle = "Preparing today's lesson on";
      bigTitle = label.suggestion;
    } else if (label.type === "situation") {
      subtitle = "Preparing today's lesson for";
      bigTitle = label.suggestion;
    } else {
      subtitle = "Preparing today's lesson with";
      bigTitle = "Three of Your Study Words";
    }

    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 10rem)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "8%", maxWidth: "320px", width: "100%" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, marginBottom: "4px" }}>
            {subtitle}
          </p>
          <h1 style={{ color: zeeguuOrange, margin: 0, marginBottom: "20px", fontSize: "2rem" }}>
            {bigTitle}
          </h1>

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
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginTop: "8px",
              marginBottom: "16px",
              minHeight: "1.4em",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {progressDetail}
          </p>
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-light)",
            borderRadius: "12px",
            padding: "16px 20px",
            maxWidth: "320px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p style={{ color: "var(--text-primary)", margin: 0, fontSize: "16px", textAlign: "center" }}>
            This can take a moment.<br />
            Feel free to browse — your lesson will be here when it's ready.
          </p>
        </div>

        <div style={{ flex: 1 }} />
      </div>
    );
  }

  if (lessonData) {
    return (
      <>
        <TodayEpisodeCard
          lessonData={lessonData}
          setLessonData={setLessonData}
          error={error}
          api={api}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          listeningSession={listeningSession}
          currentPlaybackTime={currentPlaybackTime}
          setCurrentPlaybackTime={setCurrentPlaybackTime}
          onChangeTopic={() => setSettingsOpen(true)}
        />
        {settingsDialog}
      </>
    );
  }

  // No lesson + configured + no error, and auto-gen hasn't fired yet: it's
  // about to. Once it HAS fired, never sit on this spinner forever — fall
  // through to the actionable view below (e.g. after a failed/exhausted run).
  if (isConfigured && !error && !autoGenAttemptedRef.current) {
    return (
      <div style={{ padding: "20px" }}>
        <LoadingAnimation>
          <p>Preparing today's lesson...</p>
        </LoadingAnimation>
      </div>
    );
  }

  // First-run setup, or a generation error that the user can retry by changing
  // the topic.
  return (
    <>
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 12rem)",
        }}
      >
        <div style={{ fontSize: "2.5rem" }} aria-hidden>🎧</div>
        <h2 style={{ color: zeeguuOrange, margin: "8px 0" }}>
          {error ? "Let's try a different topic" : "A new lesson, daily"}
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "300px", marginBottom: "24px" }}>
          {error ||
            "Choose what you'd like to listen to. We'll make you a fresh lesson on it daily — starting with today's."}
        </p>
        <BannerButton onClick={() => setSettingsOpen(true)} style={{ padding: "12px 24px", fontSize: "1rem" }}>
          {isConfigured ? "Change daily topic" : "Set up my daily lessons"}
        </BannerButton>
        <div style={{ marginTop: "24px" }}>
          <SubtleTextButton onClick={() => history.push("/daily-audio/past-lessons")}>
            See past lessons →
          </SubtleTextButton>
        </div>
      </div>
      {settingsDialog}
    </>
  );
}
