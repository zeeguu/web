import { useEffect, useState, useRef, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import useSession from "./useSession";

// DOM activity strategy on top of useSession: 1Hz tick counter, idle
// detection via useIdleTimer, focus/blur pause/resume. Used by reading,
// browsing, exercise, and watching sessions. Listening uses
// useListeningSession instead because audio playing is its own activity
// model.
export default function useDomActivitySession({
  label,
  apiCreate,
  apiUpdate,
  apiEnd,
  sessionKey,
  enabled = true,
  idleTimeout = 30000,
  uploadInterval = 10,
  autoStart = false,
  startOnActivity = false,
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

  const getCurrentDuration = useCallback(() => sessionDurationRef.current, []);

  const session = useSession({
    sessionKey,
    label,
    apiCreate,
    apiUpdate,
    apiEnd,
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

  // Auto-start if configured and enabled (e.g., resource id is loaded).
  useEffect(() => {
    if (autoStart && enabled) start();
  }, [autoStart, enabled, start]);

  return {
    sessionId: session.sessionId,
    getSessionId: session.getSessionId,
    sessionDuration,
    hasStarted,
    isTimerActive,
    start,
    end,
  };
}
