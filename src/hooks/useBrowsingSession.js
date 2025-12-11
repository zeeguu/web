import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useIdleTimer } from "react-idle-timer";
import { APIContext } from "../contexts/APIContext";

/**
 * Hook for tracking article browsing sessions.
 *
 * Unlike reading sessions, browsing sessions:
 * - Start only after the first meaningful interaction (scroll, click on article action)
 * - Use a shorter idle timeout (15 seconds vs 30 seconds)
 * - Track time spent browsing articles
 *
 * @returns {object} - { browsingSessionId, hasSessionStarted, activityTimer }
 */
export default function useBrowsingSession() {
  const api = useContext(APIContext);

  const [browsingSessionId, setBrowsingSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  useEffect(() => {
    sessionIdRef.current = browsingSessionId;
  }, [browsingSessionId]);

  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const sessionStartedRef = useRef(false);
  // Keep refs in sync with state (state is single source of truth)
  useEffect(() => {
    sessionStartedRef.current = hasSessionStarted;
  }, [hasSessionStarted]);

  const [activityTimer, setActivityTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // Start the browsing session
  // **************************
  const startSession = useCallback(() => {
    if (sessionStartedRef.current || !api) return;

    setHasSessionStarted(true);
    setIsTimerActive(true);

    api.browsingSessionCreate((sessionId) => {
      setBrowsingSessionId(sessionId);
    });
  }, [api]);

  // Upload current activity to the server
  // *************************************
  const uploadActivity = useCallback(() => {
    if (sessionIdRef.current && activityTimer > 0) {
      api.browsingSessionUpdate(sessionIdRef.current, activityTimer);
    }
  }, [api, activityTimer]);

  // End the session
  // ***************
  const endSession = useCallback(() => {
    if (sessionIdRef.current && activityTimer > 0) {
      api.browsingSessionEnd(sessionIdRef.current, activityTimer);
    }
  }, [api, activityTimer]);

  // Idle timer with 15 second timeout (shorter than reading's 30 seconds)
  // *********************************************************************
  const { reset: resetIdleTimer } = useIdleTimer({
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
    onAction: () => {
      // Start session on first action if not started
      if (!sessionStartedRef.current) {
        startSession();
      }
    },
    timeout: 15_000, // 15 seconds idle timeout
    eventsThrottle: 500,
    startOnMount: true,
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
  // *************************
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
  // *************************************************
  useEffect(() => {
    if (hasSessionStarted && isTimerActive && activityTimer > 0 && activityTimer % 10 === 0) {
      uploadActivity();
    }
  }, [activityTimer, hasSessionStarted, isTimerActive, uploadActivity]);

  // Focus/blur handling
  // *************************************************
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      if (sessionStartedRef.current) {
        setIsTimerActive(true);
        resetIdleTimer(); // Reset idle timer to detect new activity
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
  }, [isTimerActive, uploadActivity, resetIdleTimer, activityTimer]);

  // Cleanup on unmount
  // *************************************************
  useEffect(() => {
    return () => {
      if (sessionIdRef.current) {
        endSession();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Getter function for context - reads from ref for latest value
  const getBrowsingSessionId = useCallback(() => sessionIdRef.current, []);

  return {
    browsingSessionId,
    getBrowsingSessionId,
    hasSessionStarted,
    activityTimer,
  };
}
