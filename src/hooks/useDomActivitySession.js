import { useEffect, useState, useRef, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import useSession from "./useSession";

// DOM activity strategy on top of useSession: 1Hz tick counter, idle
// detection via useIdleTimer, focus/blur pause/resume. Used by reading,
// browsing, and exercise sessions. Listening uses useListeningSession
// instead because audio playing is its own activity model.
export default function useDomActivitySession({
  type,
  resourceId,
  createParams = {},
  idleTimeout = 30000,
  uploadInterval = 10,
  autoStart = false,
  startOnActivity = false,
  sessionKey,
} = {}) {
  const [sessionDuration, setSessionDuration] = useState(0);
  const sessionDurationRef = useRef(0);
  useEffect(() => {
    sessionDurationRef.current = sessionDuration;
  }, [sessionDuration]);

  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  useEffect(() => {
    hasStartedRef.current = hasStarted;
  }, [hasStarted]);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // The lifecycle primitive needs a way to read the current duration
  // when it flushes (on update or cleanup). Just hand it our ref.
  const getCurrentDuration = useCallback(() => sessionDurationRef.current, []);

  const session = useSession({
    type,
    sessionKey,
    resourceId,
    createParams,
    getCurrentDuration,
  });

  // Wrap the primitive's start with our local "has started" tracking.
  const start = useCallback(() => {
    if (hasStartedRef.current) return;
    setHasStarted(true);
    setIsTimerActive(true);
    setSessionDuration(0);
    sessionDurationRef.current = 0;
    session.start();
  }, [session]);

  const end = useCallback(() => {
    session.end();
    setHasStarted(false);
    setIsTimerActive(false);
  }, [session]);

  const reset = useCallback(() => {
    setHasStarted(false);
    setIsTimerActive(false);
    setSessionDuration(0);
    sessionDurationRef.current = 0;
  }, []);

  // Idle timer wires DOM events into our active/idle state. On first
  // interaction (when startOnActivity is set), this is also what kicks
  // off a new session.
  const { reset: resetIdleTimer } = useIdleTimer({
    onActive: () => {
      if (hasStartedRef.current) {
        if (isFocused) setIsTimerActive(true);
      } else if (startOnActivity) {
        start();
      }
    },
    onIdle: () => {
      if (isTimerActive) session.upload();
      setIsTimerActive(false);
    },
    onAction: () => {
      if (!hasStartedRef.current && startOnActivity) start();
    },
    timeout: idleTimeout,
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

  // 1Hz tick that increments duration while active.
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      if (isTimerActive) setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isTimerActive]);

  // Periodic upload at uploadInterval seconds.
  useEffect(() => {
    if (hasStarted && isTimerActive && sessionDuration > 0 && sessionDuration % uploadInterval === 0) {
      session.upload();
    }
  }, [sessionDuration, hasStarted, isTimerActive, session, uploadInterval]);

  // Pause on blur, resume on focus.
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      if (hasStartedRef.current) {
        setIsTimerActive(true);
        resetIdleTimer();
      }
    };
    const handleBlur = () => {
      if (isTimerActive) session.upload();
      setIsTimerActive(false);
      setIsFocused(false);
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isTimerActive, session, resetIdleTimer]);

  // Auto-start if configured.
  useEffect(() => {
    if (autoStart && resourceId) start();
  }, [autoStart, resourceId, start]);

  return {
    sessionId: session.sessionId,
    getSessionId: session.getSessionId,
    sessionDuration,
    hasStarted,
    isTimerActive,
    start,
    end,
    upload: session.upload,
    reset,
  };
}
