import { useEffect, useRef, useCallback, useContext } from "react";
import { APIContext } from "../contexts/APIContext";

const UPDATE_INTERVAL = 10000; // Update session every 10 seconds

/**
 * Hook for tracking audio listening sessions.
 *
 * Unlike reading/browsing sessions, listening sessions:
 * - Start explicitly when play is pressed (not on idle/activity detection)
 * - Track wall-clock time while audio is playing
 * - End explicitly when paused or audio ends
 * - Don't use idle detection (audio playing = active)
 *
 * @param {string|number} lessonId - The ID of the audio lesson
 * @returns {object} - { start, end, isActive }
 */
export default function useListeningSession(lessonId) {
  const api = useContext(APIContext);

  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const updateTimerRef = useRef(null);
  const isActiveRef = useRef(false);

  // Calculate elapsed seconds since session started
  const getElapsedSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  // Start a new listening session
  const start = useCallback(() => {
    if (!lessonId || !api || isActiveRef.current) return;

    api.listeningSessionCreate(lessonId, (sessionId) => {
      console.log("Started listening session:", sessionId);
      sessionIdRef.current = sessionId;
      startTimeRef.current = Date.now();
      isActiveRef.current = true;

      // Set up periodic updates
      updateTimerRef.current = setInterval(() => {
        if (sessionIdRef.current && startTimeRef.current) {
          const elapsed = getElapsedSeconds();
          api.listeningSessionUpdate(sessionIdRef.current, elapsed);
        }
      }, UPDATE_INTERVAL);
    });
  }, [lessonId, api, getElapsedSeconds]);

  // End the current listening session
  const end = useCallback(() => {
    // Clear the update timer
    if (updateTimerRef.current) {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = null;
    }

    // End the session with final duration
    if (sessionIdRef.current && startTimeRef.current && api) {
      const elapsed = getElapsedSeconds();
      console.log("Ending listening session:", sessionIdRef.current, "duration:", elapsed, "seconds");
      api.listeningSessionEnd(sessionIdRef.current, elapsed);
    }

    // Reset state
    sessionIdRef.current = null;
    startTimeRef.current = null;
    isActiveRef.current = false;
  }, [api, getElapsedSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
      // End any active session
      if (sessionIdRef.current && startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        api?.listeningSessionEnd(sessionIdRef.current, elapsed);
      }
    };
  }, [api]);

  return {
    start,
    end,
    isActive: isActiveRef.current,
    getSessionId: () => sessionIdRef.current,
  };
}
