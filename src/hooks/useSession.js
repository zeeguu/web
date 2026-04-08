import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useIdleTimer } from "react-idle-timer";
import { APIContext } from "../contexts/APIContext";

/**
 * Generic hook for tracking activity sessions (reading, browsing, exercise).
 *
 * Listening sessions use a separate `useListeningSession` hook because their
 * time model is fundamentally different — wall-clock accumulation across
 * play/pause segments, no DOM-event-based idle detection (audio playing is
 * activity), and explicit pause/resume.
 *
 * Handles all common session logic:
 * - Session creation, updates, and ending
 * - Timer that increments while user is active
 * - Idle detection (pauses timer after timeout)
 * - Focus/blur handling (pauses on blur, resumes on focus)
 * - Periodic uploads (every 10 seconds)
 * - Cleanup on unmount or when sessionKey changes
 *
 * @param {object} config - Configuration object
 * @param {string} config.type - Session type: 'reading' | 'browsing' | 'exercise'
 * @param {string|number} config.resourceId - ID of the resource (articleId, etc.)
 * @param {object} config.createParams - Additional params for session creation (e.g., { reading_source: 'web' })
 * @param {number} config.idleTimeout - Idle timeout in ms (default: 30000)
 * @param {number} config.uploadInterval - How often to upload in seconds (default: 10)
 * @param {boolean} config.autoStart - Start session immediately on mount (default: false)
 * @param {boolean} config.startOnActivity - Start session on first user activity (default: false)
 * @param {*} config.sessionKey - When this value changes, the current session is
 *   ended and the hook resets so a new one can start. Use this for any value
 *   whose change conceptually invalidates the current session (e.g., pass
 *   `userDetails.learned_language` to scope a session to a single language).
 *
 * @returns {object} - Session state and controls
 */
export default function useSession({
  type,
  resourceId,
  createParams = {},
  idleTimeout = 30000,
  uploadInterval = 10,
  autoStart = false,
  startOnActivity = false,
  sessionKey,
} = {}) {
  const api = useContext(APIContext);

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Rate limiting - prevent upload spam from buggy clients
  const lastUploadTimeRef = useRef(0);

  // Track whether session has been started
  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);
  useEffect(() => {
    hasStartedRef.current = hasStarted;
  }, [hasStarted]);

  // Timer state
  const [sessionDuration, setSessionDuration] = useState(0);
  const sessionDurationRef = useRef(0);
  useEffect(() => {
    sessionDurationRef.current = sessionDuration;
  }, [sessionDuration]);

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  // API method mapping - all session types now use consistent naming
  const apiMethods = {
    reading: {
      create: (callback) => api.readingSessionCreate(resourceId, createParams.reading_source, callback),
      update: (id, dur) => api.readingSessionUpdate(id, dur),
      end: (id, dur) => api.readingSessionEnd(id, dur),
    },
    browsing: {
      create: (callback) => api.browsingSessionCreate(callback),
      update: (id, dur) => api.browsingSessionUpdate(id, dur),
      end: (id, dur) => api.browsingSessionEnd(id, dur),
    },
    exercise: {
      create: (callback) => api.exerciseSessionCreate(callback),
      update: (id, dur) => api.exerciseSessionUpdate(id, dur),
      end: (id, dur) => api.exerciseSessionEnd(id, dur),
    },
  };

  const methods = apiMethods[type];

  // Start the session
  const start = useCallback(() => {
    if (hasStartedRef.current || !api || !methods) return;

    setHasStarted(true);
    setIsTimerActive(true);
    setSessionDuration(0);
    sessionDurationRef.current = 0;

    methods.create((id) => {
      console.log(`Started ${type} session:`, id, "(sessionKey:", sessionKey, ")");
      setSessionId(id);
    });
  }, [api, methods, type, sessionKey]);

  // Upload current duration to server (rate limited to prevent spam)
  const upload = useCallback(() => {
    const now = Date.now();
    // Rate limit: max once per 5 seconds to prevent buggy clients from spamming
    if (now - lastUploadTimeRef.current < 5000) return;

    if (sessionIdRef.current && sessionDurationRef.current > 0 && methods) {
      lastUploadTimeRef.current = now;
      methods.update(sessionIdRef.current, sessionDurationRef.current);
    }
  }, [methods]);

  // End the session
  const end = useCallback(() => {
    if (sessionIdRef.current && methods) {
      methods.end(sessionIdRef.current, sessionDurationRef.current);
      setSessionId(null);
      setHasStarted(false);
      setIsTimerActive(false);
    }
  }, [methods]);

  // Reset for a new session (without ending the current one)
  const reset = useCallback(() => {
    setSessionId(null);
    setHasStarted(false);
    setIsTimerActive(false);
    setSessionDuration(0);
    sessionDurationRef.current = 0;
  }, []);

  // Idle timer
  const { reset: resetIdleTimer } = useIdleTimer({
    onActive: () => {
      if (hasStartedRef.current) {
        if (isFocused) setIsTimerActive(true);
      } else if (startOnActivity) {
        start();
      }
    },
    onIdle: () => {
      if (isTimerActive) {
        upload();
      }
      setIsTimerActive(false);
    },
    onAction: () => {
      if (!hasStartedRef.current && startOnActivity) {
        start();
      }
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

  // Timer increment
  useEffect(() => {
    if (!hasStarted) return;

    const interval = setInterval(() => {
      if (isTimerActive) {
        setSessionDuration((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isTimerActive]);

  // Periodic upload
  useEffect(() => {
    if (hasStarted && isTimerActive && sessionDuration > 0 && sessionDuration % uploadInterval === 0) {
      upload();
    }
  }, [sessionDuration, hasStarted, isTimerActive, upload, uploadInterval]);

  // Focus/blur handling
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
      if (hasStartedRef.current) {
        setIsTimerActive(true);
        resetIdleTimer();
      }
    };

    const handleBlur = () => {
      if (isTimerActive) {
        upload();
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
  }, [isTimerActive, upload, resetIdleTimer]);

  // Auto-start if configured
  useEffect(() => {
    if (autoStart && resourceId) {
      start();
    }
  }, [autoStart, resourceId, start]);

  // End any active session on unmount OR when sessionKey changes. Browsing
  // and exercise host components don't unmount on a language toggle, just
  // re-render, so without this the session would keep accumulating time
  // against the old language indefinitely.
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && methods) {
        console.log(
          `Ending ${type} session:`,
          sessionIdRef.current,
          "duration:",
          sessionDurationRef.current,
          "seconds (sessionKey was:",
          sessionKey,
          ")",
        );
        methods.end(sessionIdRef.current, sessionDurationRef.current);
      }
      sessionIdRef.current = null;
      sessionDurationRef.current = 0;
      hasStartedRef.current = false;
      lastUploadTimeRef.current = 0;
      setSessionId(null);
      setSessionDuration(0);
      setHasStarted(false);
      setIsTimerActive(false);
    };
    // `methods` is intentionally omitted: it's recreated every render so
    // including it would re-run the effect constantly. The cleanup captures
    // the current value at the time the previous effect ran.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  // Getter for session ID (reads from ref for latest value)
  const getSessionId = useCallback(() => sessionIdRef.current, []);

  return {
    sessionId,
    getSessionId,
    sessionDuration,
    hasStarted,
    isTimerActive,
    start,
    end,
    upload,
    reset,
  };
}
