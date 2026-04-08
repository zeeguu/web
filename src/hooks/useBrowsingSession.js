import { useCallback, useContext } from "react";
import useDomActivitySession from "./useDomActivitySession";
import { UserContext } from "../contexts/UserContext";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for tracking article browsing sessions.
 *
 * Unlike reading sessions, browsing sessions:
 * - Start only after the first meaningful interaction (scroll, click on article action)
 * - Use a shorter idle timeout (15 seconds vs 30 seconds)
 * - Track time spent browsing articles
 * - Are scoped to a single learned_language; toggling language ends the
 *   current session and the next interaction starts a fresh one.
 */
export default function useBrowsingSession() {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const session = useDomActivitySession({
    label: "browsing",
    sessionKey: userDetails?.learned_language,
    idleTimeout: 15_000, // 15 seconds (shorter than reading's 30 seconds)
    startOnActivity: true, // Start on first user interaction
    apiCreate: (cb) => api.browsingSessionCreate(cb),
    apiUpdate: (id, dur) => api.browsingSessionUpdate(id, dur),
    apiEnd: (id, dur) => api.browsingSessionEnd(id, dur),
  });

  // Getter (not a value) so consumers like InteractiveText can read the
  // *current* sessionId at interaction time, not a stale capture from
  // when they were rendered.
  const getBrowsingSessionId = useCallback(() => session.getSessionId(), [session]);

  return {
    browsingSessionId: session.sessionId,
    getBrowsingSessionId,
    hasSessionStarted: session.hasStarted,
    sessionDuration: session.sessionDuration,
  };
}
