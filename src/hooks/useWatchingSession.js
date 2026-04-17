import { useCallback, useContext } from "react";
import useDomActivitySession from "./useDomActivitySession";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for tracking video watching sessions.
 *
 * Watching sessions:
 * - Start when the video id is known (autoStart, gated by enabled)
 * - Use 30 second idle timeout (same as reading)
 * - Track time spent watching
 *
 * @param {string|number} videoId - The video being watched
 * @param {boolean} enabled - Whether to start the session (default: true)
 */
export default function useWatchingSession(videoId, enabled = true) {
  const api = useContext(APIContext);
  const session = useDomActivitySession({
    label: "watching",
    sessionKey: videoId,
    enabled: enabled && !!videoId,
    autoStart: true,
    idleTimeout: 30_000,
    apiCreate: (cb) => api.createWatchingSession(videoId, cb),
    apiUpdate: (id, dur) => api.updateWatchingSession(id, dur),
    apiEnd: (id, dur) => api.endWatchingSession(id, dur),
  });

  const getWatchingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    watchingSessionId: session.sessionId,
    getWatchingSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
