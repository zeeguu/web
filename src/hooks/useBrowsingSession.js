import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useIdleTimer } from "react-idle-timer";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for tracking article browsing sessions.
 *
 * Unlike reading sessions, browsing sessions:
 * - Start only after the first meaningful interaction (scroll, click on article action)
 * - Use a shorter idle timeout (15 seconds vs 30 seconds)
 * - Track time spent on article list pages (home, search, saved, etc.)
 *
 * @param {string} pageType - The type of page being browsed (home, search, saved, classroom, etc.)
 * @returns {object} - { browsingSessionId, hasSessionStarted, activityTimer }
 */
export default function useBrowsingSession(pageType) {
  const api = useContext(APIContext);

  const [browsingSessionId, setBrowsingSessionId] = useState(null);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [activityTimer, setActivityTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Use ref to track if session has started to avoid closure issues
  const sessionStartedRef = useRef(false);
  const sessionIdRef = useRef(null);

  // Start the browsing session
  const startSession = useCallback(() => {
    if (sessionStartedRef.current || !api) return;

    sessionStartedRef.current = true;
    setHasSessionStarted(true);
    setIsTimerActive(true);

    api.browsingSessionCreate(pageType, (sessionId) => {
      sessionIdRef.current = sessionId;
      setBrowsingSessionId(sessionId);
    });
  }, [api, pageType]);

  // Upload current activity to the server
  const uploadActivity = useCallback(() => {
    if (sessionIdRef.current && activityTimer > 0) {
      api.browsingSessionUpdate(sessionIdRef.current, activityTimer);
    }
  }, [api, activityTimer]);

  // End the session
  const endSession = useCallback(() => {
    if (sessionIdRef.current && activityTimer > 0) {
      api.browsingSessionEnd(sessionIdRef.current, activityTimer);
    }
  }, [api, activityTimer]);

  // Idle timer with 15 second timeout (shorter than reading's 30 seconds)
  useIdleTimer({
    onActive: () => {
      if (sessionStartedRef.current) {
        // Session was already started, resume timer
        if (isFocused) setIsTimerActive(true);
      } else {
        // First interaction - start the session
        startSession();
      }
    },
    onIdle: () => {
      if (isTimerActive) {
        uploadActivity();
      }
      setIsTimerActive(false);
    },
    timeout: 15_000, // 15 seconds idle timeout
    eventsThrottle: 500,
    events: [
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "scroll",
    ],
  });

  // Timer increment effect
  useEffect(() => {
    if (!hasSessionStarted) return;

    const interval = setInterval(() => {
      if (isTimerActive) {
        setActivityTimer((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasSessionStarted, isTimerActive]);

  // Periodic upload (every 10 seconds of active time)
  useEffect(() => {
    if (hasSessionStarted && isTimerActive && activityTimer > 0 && activityTimer % 10 === 0) {
      uploadActivity();
    }
  }, [activityTimer, hasSessionStarted, isTimerActive, uploadActivity]);

  // Focus/blur handling
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      if (sessionStartedRef.current) {
        setIsTimerActive(true);
      }
    };

    const handleBlur = () => {
      if (isTimerActive) {
        uploadActivity();
      }
      setIsTimerActive(false);
      setIsFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isTimerActive, uploadActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    browsingSessionId,
    hasSessionStarted,
    activityTimer,
  };
}
