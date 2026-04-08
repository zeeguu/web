import { useCallback, useContext } from "react";
import useDomActivitySession from "./useDomActivitySession";
import { UserContext } from "../contexts/UserContext";
import { APIContext } from "../contexts/APIContext";

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
 * @param {boolean} enabled - Whether to start the session (default: true)
 */
export default function useExerciseSession(enabled = true) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const session = useDomActivitySession({
    label: "exercise",
    sessionKey: userDetails?.learned_language,
    enabled,
    autoStart: true,
    idleTimeout: 30_000,
    apiCreate: (cb) => api.exerciseSessionCreate(cb),
    apiUpdate: (id, dur) => api.exerciseSessionUpdate(id, dur),
    apiEnd: (id, dur) => api.exerciseSessionEnd(id, dur),
  });

  // Getter (not a value) so consumers can read the *current* sessionId at
  // interaction time, not a stale capture from when they were rendered.
  const getExerciseSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    exerciseSessionId: session.sessionId,
    getExerciseSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
