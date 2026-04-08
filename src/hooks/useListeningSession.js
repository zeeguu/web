import { useEffect, useRef, useCallback, useContext } from "react";
import { APIContext } from "../contexts/APIContext";

const UPDATE_INTERVAL = 10000; // Update session every 10 seconds

/**
 * Hook for tracking audio listening sessions with accumulated time.
 *
 * Unlike reading/browsing sessions, listening sessions:
 * - Start explicitly when play is pressed (not on idle/activity detection)
 * - Track wall-clock time while audio is playing
 * - Pause/resume to accumulate time across play/pause cycles
 * - End on unmount or when audio completes
 * - Don't use idle detection (audio playing = active)
 *
 * @param {string|number} lessonId - The ID of the audio lesson
 * @returns {object} - { start, pause, resume, end, isActive }
 */
export default function useListeningSession(lessonId) {
  const api = useContext(APIContext);

  const sessionIdRef = useRef(null);
  const segmentStartRef = useRef(null); // When current play segment started
  const accumulatedSecondsRef = useRef(0); // Total accumulated time from previous segments
  const updateTimerRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Calculate total elapsed seconds (accumulated + current segment)
  const getTotalElapsedSeconds = useCallback(() => {
    let total = accumulatedSecondsRef.current;
    if (segmentStartRef.current) {
      total += Math.floor((Date.now() - segmentStartRef.current) / 1000);
    }
    return total;
  }, []);

  // Start periodic update timer
  const startUpdateTimer = useCallback(() => {
    if (updateTimerRef.current) return; // Already running

    updateTimerRef.current = setInterval(() => {
      if (sessionIdRef.current && isPlayingRef.current) {
        const elapsed = getTotalElapsedSeconds();
        api.listeningSessionUpdate(sessionIdRef.current, elapsed);
      }
    }, UPDATE_INTERVAL);
  }, [api, getTotalElapsedSeconds]);

  // Stop periodic update timer
  const stopUpdateTimer = useCallback(() => {
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = null;
    }
  }, []);

  // Start a new listening session (first play)
  const start = useCallback(() => {
    if (!lessonId || !api) return;

    // If already have a session, just resume
    if (sessionIdRef.current) {
      segmentStartRef.current = Date.now();
      isPlayingRef.current = true;
      startUpdateTimer();
      return;
    }

    api.listeningSessionCreate(lessonId, (sessionId) => {
      console.log("Started listening session:", sessionId);
      sessionIdRef.current = sessionId;
      segmentStartRef.current = Date.now();
      accumulatedSecondsRef.current = 0;
      isPlayingRef.current = true;
      startUpdateTimer();
    });
  }, [lessonId, api, startUpdateTimer]);

  // Pause - stops tracking but keeps session alive
  const pause = useCallback(() => {
    if (!isPlayingRef.current) return;

    // Accumulate time from this segment
    if (segmentStartRef.current) {
      accumulatedSecondsRef.current += Math.floor((Date.now() - segmentStartRef.current) / 1000);
      segmentStartRef.current = null;
    }

    isPlayingRef.current = false;
    stopUpdateTimer();

    // Upload current progress
    if (sessionIdRef.current && api) {
      const elapsed = getTotalElapsedSeconds();
      console.log("Paused listening session:", sessionIdRef.current, "accumulated:", elapsed, "seconds");
      api.listeningSessionUpdate(sessionIdRef.current, elapsed);
    }
  }, [api, getTotalElapsedSeconds, stopUpdateTimer]);

  // Resume - continues tracking the same session
  const resume = useCallback(() => {
    if (isPlayingRef.current) return;
    if (!sessionIdRef.current) {
      // No session yet, start a new one
      start();
      return;
    }

    segmentStartRef.current = Date.now();
    isPlayingRef.current = true;
    startUpdateTimer();
    console.log("Resumed listening session:", sessionIdRef.current);
  }, [start, startUpdateTimer]);

  // End the session completely (on unmount or audio complete)
  const end = useCallback(() => {
    stopUpdateTimer();

    // Calculate final duration
    if (segmentStartRef.current) {
      accumulatedSecondsRef.current += Math.floor((Date.now() - segmentStartRef.current) / 1000);
      segmentStartRef.current = null;
    }

    // End the session with final duration
    if (sessionIdRef.current && api) {
      const elapsed = getTotalElapsedSeconds();
      console.log("Ending listening session:", sessionIdRef.current, "total duration:", elapsed, "seconds");
      api.listeningSessionEnd(sessionIdRef.current, elapsed);
    }

    // Reset state
    sessionIdRef.current = null;
    accumulatedSecondsRef.current = 0;
    isPlayingRef.current = false;
  }, [api, getTotalElapsedSeconds, stopUpdateTimer]);

  // End any active session on unmount OR when the lessonId changes (e.g.,
  // when the user toggles their learned language and TodayAudio resets
  // lessonData to null). Without lessonId in the deps, the interval timer
  // and session refs persisted across language toggles, so the next 10s
  // tick would push a listeningSessionUpdate that the backend then
  // credited to the *new* language.
  useEffect(() => {
    return () => {
      stopUpdateTimer();
      if (sessionIdRef.current) {
        let total = accumulatedSecondsRef.current;
        if (segmentStartRef.current) {
          total += Math.floor((Date.now() - segmentStartRef.current) / 1000);
        }
        console.log(
          "Ending listening session:",
          sessionIdRef.current,
          "total duration:",
          total,
          "seconds (lessonId now:",
          lessonId,
          ")",
        );
        api?.listeningSessionEnd(sessionIdRef.current, total);
      }
      // Reset state so a new lessonId starts from scratch
      sessionIdRef.current = null;
      accumulatedSecondsRef.current = 0;
      segmentStartRef.current = null;
      isPlayingRef.current = false;
    };
  }, [api, stopUpdateTimer, lessonId]);

  return {
    start,
    pause,
    resume,
    end,
    isPlaying: isPlayingRef.current,
    getSessionId: () => sessionIdRef.current,
  };
}
