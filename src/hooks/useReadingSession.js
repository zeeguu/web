import { useCallback, useContext, useEffect, useRef } from "react";
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
    exposeLiveDuration: true, // ArticleReader shows a live DigitalTimer
    apiCreate: (cb) => api.readingSessionCreate(articleId, readingSource, cb),
    apiUpdate: (id, dur) => api.readingSessionUpdate(id, dur),
    apiEnd: (id, dur) => api.readingSessionEnd(id, dur),
  });

  // Log the clock stopping while the page still has focus (idle) and
  // starting again (active, also the first action back after leaving), so
  // the teacher's focus strip can tell a page left open from one being read.
  // Stopping on blur is logged as lost focus by the reader.
  const wasActive = useRef(null);
  const { isTimerActive } = session;
  useEffect(() => {
    if (wasActive.current === null) {
      wasActive.current = isTimerActive;
      return;
    }
    if (wasActive.current && !isTimerActive && document.hasFocus()) {
      api.logUserActivity(api.ARTICLE_IDLE, articleId);
    } else if (!wasActive.current && isTimerActive) {
      api.logUserActivity(api.ARTICLE_ACTIVE, articleId);
    }
    wasActive.current = isTimerActive;
  }, [api, articleId, isTimerActive]);

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
