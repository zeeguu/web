import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { APIContext } from "../contexts/APIContext";
import useShadowRef from "./useShadowRef";

// Lifecycle primitive: owns the session id, the API plumbing, and the
// cleanup-on-sessionKey-change effect. Activity strategies (DOM events,
// audio segments) layer on top via useDomActivitySession or
// useListeningSession and supply getCurrentDuration so this primitive
// can flush the right value on cleanup.
export default function useSession({
  type,
  sessionKey,
  resourceId,
  createParams = {},
  getCurrentDuration,
}) {
  const api = useContext(APIContext);

  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const lastUploadTimeRef = useRef(0);

  // The cleanup-on-key-change effect closes over the duration callback
  // at the time the previous render ran. Use a shadow ref so the closure
  // always reaches the latest version without putting the callback in
  // the effect's dep array (which would cause it to run every render).
  const getCurrentDurationRef = useShadowRef(getCurrentDuration);

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
    listening: {
      create: (callback) => api.listeningSessionCreate(resourceId, callback),
      update: (id, dur) => api.listeningSessionUpdate(id, dur),
      end: (id, dur) => api.listeningSessionEnd(id, dur),
    },
  };
  const methods = apiMethods[type];

  // Start a new session on the server. Idempotent — calling it while a
  // session is already alive is a no-op.
  const start = useCallback(() => {
    if (sessionIdRef.current || !api || !methods) return;
    methods.create((id) => {
      console.log(`Started ${type} session:`, id, "(sessionKey:", sessionKey, ")");
      sessionIdRef.current = id;
      setSessionId(id);
    });
  }, [api, methods, type, sessionKey]);

  // Upload current duration. Rate-limited to once per 5 seconds to
  // protect against buggy callers (e.g., if a tick effect somehow ends
  // up firing multiple times per second).
  const upload = useCallback(() => {
    const now = Date.now();
    if (now - lastUploadTimeRef.current < 5000) return;
    if (sessionIdRef.current && methods) {
      lastUploadTimeRef.current = now;
      methods.update(sessionIdRef.current, getCurrentDurationRef.current());
    }
  }, [methods, getCurrentDurationRef]);

  // End the current session. Used by the audio strategy when audio
  // completes; the DOM strategy doesn't need to call this explicitly
  // because the cleanup-on-key-change effect handles unmount and
  // sessionKey changes.
  const end = useCallback(() => {
    if (!sessionIdRef.current || !methods) return;
    const duration = getCurrentDurationRef.current();
    console.log(`Ending ${type} session:`, sessionIdRef.current, "duration:", duration, "seconds");
    methods.end(sessionIdRef.current, duration);
    sessionIdRef.current = null;
    setSessionId(null);
    lastUploadTimeRef.current = 0;
  }, [methods, type, getCurrentDurationRef]);

  // The shared lifecycle: end any active session on unmount or when
  // sessionKey changes. This is the *single* place lifecycle bugs need
  // to be fixed — both DOM and audio strategies inherit it for free.
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && methods) {
        const duration = getCurrentDurationRef.current();
        console.log(
          `Ending ${type} session:`,
          sessionIdRef.current,
          "duration:",
          duration,
          "seconds (sessionKey was:",
          sessionKey,
          ")",
        );
        methods.end(sessionIdRef.current, duration);
      }
      sessionIdRef.current = null;
      setSessionId(null);
      lastUploadTimeRef.current = 0;
    };
    // `methods` is intentionally omitted: it's recreated every render,
    // so including it would re-run the effect constantly. The cleanup
    // captures the current value at the time the previous effect ran.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const getSessionId = useCallback(() => sessionIdRef.current, []);

  return { sessionId, getSessionId, start, upload, end };
}
