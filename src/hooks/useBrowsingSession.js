import { useCallback } from "react";
import useSession from "./useSession";

/**
 * Hook for tracking article browsing sessions.
 *
 * Unlike reading sessions, browsing sessions:
 * - Start only after the first meaningful interaction (scroll, click on article action)
 * - Use a shorter idle timeout (15 seconds vs 30 seconds)
 * - Track time spent browsing articles
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @returns {object} - { browsingSessionId, getBrowsingSessionId, hasSessionStarted, activityTimer }
 */
export default function useBrowsingSession() {
  const session = useSession({
    type: "browsing",
    idleTimeout: 15_000, // 15 seconds (shorter than reading's 30 seconds)
    startOnActivity: true, // Start on first user interaction
  });

  // Provide backwards-compatible API
  const getBrowsingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    browsingSessionId: session.sessionId,
    getBrowsingSessionId,
    hasSessionStarted: session.hasStarted,
    sessionDuration: session.sessionDuration,
  };
}
