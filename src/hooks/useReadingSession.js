import { useCallback, useEffect, useRef } from "react";
import useSession from "./useSession";

/**
 * Hook for tracking article reading sessions.
 *
 * Reading sessions:
 * - Start when article data is ready (enabled=true)
 * - Use 30 second idle timeout
 * - Track time spent reading articles
 * - Support both web and extension sources
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @param {string|number} articleId - The article being read
 * @param {string} readingSource - 'web' or 'extension'
 * @param {boolean} enabled - Whether to start the session (default: true)
 * @returns {object} - { readingSessionId, getReadingSessionId, duration, ... }
 */
export default function useReadingSession(articleId, readingSource = "web", enabled = true) {
  const session = useSession({
    type: "reading",
    resourceId: articleId,
    createParams: { reading_source: readingSource },
    idleTimeout: 30_000, // 30 seconds
    autoStart: false, // We control start via enabled parameter
  });

  // Track if we've started to avoid double-starting
  const hasStartedRef = useRef(false);

  // Start session when enabled and articleId are ready
  useEffect(() => {
    if (enabled && articleId && !hasStartedRef.current) {
      session.start();
      hasStartedRef.current = true;
    }
  }, [enabled, articleId, session]);

  // Provide backwards-compatible API
  const getReadingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    readingSessionId: session.sessionId,
    getReadingSessionId,
    sessionDuration: session.sessionDuration,
    isTimerActive: session.isTimerActive,
  };
}
