import { useCallback, useContext } from "react";
import useDomActivitySession from "./useDomActivitySession";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for tracking article reading sessions.
 *
 * Reading sessions:
 * - Start when article data is ready (enabled=true)
 * - Use 30 second idle timeout
 * - Track time spent reading articles
 * - Support both web and extension sources
 *
 * @param {string|number} articleId - The article being read
 * @param {string} readingSource - 'web' or 'extension'
 * @param {boolean} enabled - Whether to start the session (default: true)
 */
export default function useReadingSession(articleId, readingSource = "web", enabled = true) {
  const api = useContext(APIContext);
  const session = useDomActivitySession({
    label: "reading",
    sessionKey: articleId,
    enabled: enabled && !!articleId,
    autoStart: true,
    idleTimeout: 30_000,
    apiCreate: (cb) => api.readingSessionCreate(articleId, readingSource, cb),
    apiUpdate: (id, dur) => api.readingSessionUpdate(id, dur),
    apiEnd: (id, dur) => api.readingSessionEnd(id, dur),
  });

  // Getter (not a value) so consumers can read the *current* sessionId at
  // interaction time, not a stale capture from when they were rendered.
  const getReadingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    readingSessionId: session.sessionId,
    getReadingSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
