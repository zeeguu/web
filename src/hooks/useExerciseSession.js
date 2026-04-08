import { useCallback, useContext, useEffect } from "react";
import useSession from "./useSession";
import { UserContext } from "../contexts/UserContext";

/**
 * Hook for tracking exercise practice sessions.
 *
 * Exercise sessions:
 * - Start when exercises are loaded (enabled=true)
 * - Use 30 second idle timeout
 * - Track time spent doing exercises
 * - Are scoped to a single learned_language; toggling language ends the
 *   current session and starts a fresh one for the new language.
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @param {boolean} enabled - Whether to start the session (default: true)
 * @returns {object} - { exerciseSessionId, getExerciseSessionId, duration, ... }
 */
export default function useExerciseSession(enabled = true) {
  const { userDetails } = useContext(UserContext);
  const session = useSession({
    type: "exercise",
    idleTimeout: 30_000, // 30 seconds
    autoStart: false, // We control start via enabled parameter
    sessionKey: userDetails?.learned_language,
  });

  // useSession.start() is internally idempotent and useSession resets
  // hasStarted on sessionKey change, so this naturally re-fires after a
  // language toggle.
  useEffect(() => {
    if (enabled && !session.hasStarted) {
      session.start();
    }
  }, [enabled, session.hasStarted, session.start]);

  // Provide backwards-compatible API
  const getExerciseSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    exerciseSessionId: session.sessionId,
    getExerciseSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
