import { useCallback, useEffect, useRef } from "react";
import useSession from "./useSession";

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
  const session = useSession({
    type: "exercise",
    idleTimeout: 30_000, // 30 seconds
    autoStart: false, // We control start via enabled parameter
  });

  // Track if we've started to avoid double-starting
  const hasStartedRef = useRef(false);

  // Start session when enabled
  useEffect(() => {
    if (enabled && !hasStartedRef.current) {
      session.start();
      hasStartedRef.current = true;
    }
  }, [enabled, session]);

  // Provide backwards-compatible API
  const getExerciseSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    exerciseSessionId: session.sessionId,
    getExerciseSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
