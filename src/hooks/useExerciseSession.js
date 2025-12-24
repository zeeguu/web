import { useCallback } from "react";
import useSession from "./useSession";

/**
 * Hook for tracking exercise practice sessions.
 *
 * Exercise sessions:
 * - Start when exercises are loaded
 * - Use 30 second idle timeout
 * - Track time spent doing exercises
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @returns {object} - { exerciseSessionId, getExerciseSessionId, duration, ... }
 */
export default function useExerciseSession() {
  const session = useSession({
    type: "exercise",
    idleTimeout: 30_000, // 30 seconds
    autoStart: true, // Start immediately when component mounts
  });

  // Provide backwards-compatible API
  const getExerciseSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    exerciseSessionId: session.sessionId,
    getExerciseSessionId,
    duration: session.duration,
    isTimerActive: session.isTimerActive,
    // Also expose these for components that need more control
    setActivityOver: () => {}, // Placeholder for compatibility - useSession handles this via idle detection
  };
}
