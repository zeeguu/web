import { useEffect, useState, useRef, useCallback } from "react";
import { useIdleTimer } from "react-idle-timer";
import useSession from "./useSession";
import useShadowRef from "./useShadowRef";

// DOM activity strategy on top of useSession: 1Hz tick counter, idle
// detection via useIdleTimer, focus/blur pause/resume. Used by reading,
// browsing, exercise, and watching sessions. Listening uses
// useListeningSession instead because audio playing is its own activity
// model.
//
// exposeLiveDuration: mirror the elapsed seconds into React state so a
// consumer can render a live-ticking timer. OFF by default: the duration
// lives in a ref (read via getCurrentDuration, uploaded periodically), so
// sessions that never display it — browsing, watching — don't re-render
// their whole subtree once a second. Only reading and exercise (which show
// a DigitalTimer) opt in.
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
  exposeLiveDuration = false,
} = {}) {
  // The ref is the source of truth for elapsed seconds; the reactive state
  // is only kept in sync when exposeLiveDuration is set (see the 1Hz tick).
  const sessionDurationRef = useRef(0);
  const [sessionDuration, setSessionDuration] = useState(0);

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

  // Shadow-ref so the 1Hz interval can fire uploads without listing `session`
  // (a fresh object each render) in its deps, which would tear down and rebuild
  // the interval every render.
  const uploadRef = useShadowRef(session.upload);

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

  // 1Hz tick: advance the ref while active, and fire the periodic upload off
  // the ref every uploadInterval seconds. The reactive state is updated only
  // when a consumer needs a live-ticking display (exposeLiveDuration) — so
  // browsing/watching sessions advance and upload without re-rendering.
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      if (!isTimerActive) return;
      sessionDurationRef.current += 1;
      if (exposeLiveDuration) setSessionDuration(sessionDurationRef.current);
      if (sessionDurationRef.current % uploadInterval === 0) uploadRef.current?.();
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isTimerActive, exposeLiveDuration, uploadInterval, uploadRef]);

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
