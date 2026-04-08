import { useCallback, useContext } from "react";
import useSession from "./useSession";
import { UserContext } from "../contexts/UserContext";

/**
 * Hook for tracking article browsing sessions.
 *
 * Unlike reading sessions, browsing sessions:
 * - Start only after the first meaningful interaction (scroll, click on article action)
 * - Use a shorter idle timeout (15 seconds vs 30 seconds)
 * - Track time spent browsing articles
 * - Are scoped to a single learned_language; toggling language ends the
 *   current session and the next interaction starts a fresh one.
 *
 * This is a thin wrapper around the generic useSession hook.
 *
 * @returns {object} - { browsingSessionId, getBrowsingSessionId, hasSessionStarted, activityTimer }
 */
export default function useBrowsingSession() {
  const { userDetails } = useContext(UserContext);
  const session = useSession({
    type: "browsing",
    idleTimeout: 15_000, // 15 seconds (shorter than reading's 30 seconds)
    startOnActivity: true, // Start on first user interaction
    sessionKey: userDetails?.learned_language,
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
