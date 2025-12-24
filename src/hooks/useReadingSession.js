import { useCallback } from "react";
import useSession from "./useSession";

/**
 * Hook for tracking article reading sessions.
 *
 * Reading sessions:
 * - Start immediately when article is opened
 * - Use 30 second idle timeout
 * - Track time spent reading articles
 * - Support both web and extension sources
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @param {string|number} articleId - The article being read
 * @param {string} readingSource - 'web' or 'extension'
 * @returns {object} - { readingSessionId, getReadingSessionId, duration, ... }
 */
export default function useReadingSession(articleId, readingSource = "web") {
  const session = useSession({
    type: "reading",
    resourceId: articleId,
    createParams: { reading_source: readingSource },
    idleTimeout: 30_000, // 30 seconds
    autoStart: true, // Start immediately when component mounts
  });

  // Provide backwards-compatible API
  const getReadingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    readingSessionId: session.sessionId,
    getReadingSessionId,
    duration: session.duration,
    isTimerActive: session.isTimerActive,
  };
}
