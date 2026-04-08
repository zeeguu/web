import { useCallback, useContext, useEffect, useRef } from "react";
import useSession from "./useSession";
import { UserContext } from "../contexts/UserContext";

/**
 * Hook for tracking exercise practice sessions.
 *
 * Exercise sessions:
 * - Start when exercises are loaded (enabled=true)
 * - Use 30 second idle timeout
 * - Track time spent doing exercises
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @param {boolean} enabled - Whether to start the session (default: true)
 * @returns {object} - { exerciseSessionId, getExerciseSessionId, duration, ... }
 */
export default function useExerciseSession(enabled = true) {
  const { userDetails } = useContext(UserContext);
  const learnedLanguage = userDetails?.learned_language;
  const session = useSession({
    type: "exercise",
    idleTimeout: 30_000, // 30 seconds
    autoStart: false, // We control start via enabled parameter
    // Scope each session to a single learned_language so a language toggle
    // ends the current session and a fresh one starts for the new language.
    sessionKey: learnedLanguage,
  });

  // Track if we've started to avoid double-starting
  const hasStartedRef = useRef(false);

  // Allow a fresh start after a language toggle (useSession resets its
  // internal state on sessionKey change; this resets the wrapper's guard).
  useEffect(() => {
    hasStartedRef.current = false;
  }, [learnedLanguage]);

  // Start session when enabled (re-fires after a language toggle because
  // hasStartedRef has been reset above)
  useEffect(() => {
    if (enabled && !hasStartedRef.current) {
      session.start();
      hasStartedRef.current = true;
    }
  }, [enabled, session, learnedLanguage]);

  // Provide backwards-compatible API
  const getExerciseSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    exerciseSessionId: session.sessionId,
    getExerciseSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
