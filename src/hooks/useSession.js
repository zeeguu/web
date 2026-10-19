import { useEffect, useState, useRef, useCallback } from "react";
import useShadowRef from "./useShadowRef";
import { reportLearningSeconds } from "../components/nativeShield";

// Lifecycle primitive: owns the session id and the cleanup-on-sessionKey
// effect. Knows nothing about HTTP, time models, or session types — those
// are injected by the caller as apiCreate/apiUpdate/apiEnd callbacks and
// the getCurrentDuration getter. Activity strategies (useDomActivitySession,
// useListeningSession) compose this primitive with their own activity model.

export default function useSession({ sessionKey, label, apiCreate, apiUpdate, apiEnd, getCurrentDuration }) {
  const [sessionId, setSessionId] = useState(null);
  const sessionIdRef = useRef(null);
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const lastUploadTimeRef = useRef(0);

  // Aiki mode earns breaks from learning time, so each report passes on the
  // seconds added since the previous one.
  const reportedDurationRef = useRef(0);
  const reportLearning = useCallback(
    (duration) => {
      reportLearningSeconds(label, duration - reportedDurationRef.current);
      reportedDurationRef.current = duration;
    },
    [label],
  );
  const reportLearningRef = useShadowRef(reportLearning);

  // Shadow-refs so the cleanup effect can read the latest values without
  // listing them in its dep array (which would re-run it constantly because
  // the api callbacks and getCurrentDuration are typically recreated every
  // render in the calling wrapper).
  const apiEndRef = useShadowRef(apiEnd);
  const getCurrentDurationRef = useShadowRef(getCurrentDuration);

  const start = useCallback(() => {
    if (sessionIdRef.current || !apiCreate) return;
    apiCreate((id) => {
      console.log(`Started ${label} session:`, id, "(sessionKey:", sessionKey, ")");
      sessionIdRef.current = id;
      setSessionId(id);
    });
  }, [apiCreate, label, sessionKey]);

  // Rate-limited to once per 5s as a defensive floor against buggy callers.
  const upload = useCallback(() => {
    const now = Date.now();
    if (now - lastUploadTimeRef.current < 5000) return;
    if (sessionIdRef.current && apiUpdate) {
      lastUploadTimeRef.current = now;
      const duration = getCurrentDurationRef.current();
      apiUpdate(sessionIdRef.current, duration);
      reportLearning(duration);
    }
  }, [apiUpdate, getCurrentDurationRef, reportLearning]);

  const end = useCallback(() => {
    if (!sessionIdRef.current || !apiEnd) return;
    const duration = getCurrentDurationRef.current();
    console.log(`Ending ${label} session:`, sessionIdRef.current, "duration:", duration, "seconds");
    apiEnd(sessionIdRef.current, duration);
    reportLearning(duration);
    reportedDurationRef.current = 0;
    sessionIdRef.current = null;
    setSessionId(null);
    lastUploadTimeRef.current = 0;
  }, [apiEnd, label, getCurrentDurationRef, reportLearning]);

  // The shared lifecycle: end any active session on unmount or when
  // sessionKey changes. This is the *single* place lifecycle bugs need
  // to be fixed — every strategy inherits it for free.
  useEffect(() => {
    return () => {
      if (sessionIdRef.current && apiEndRef.current) {
        const duration = getCurrentDurationRef.current();
        console.log(
          `Ending ${label} session:`,
          sessionIdRef.current,
          "duration:",
          duration,
          "seconds (sessionKey was:",
          sessionKey,
          ")",
        );
        apiEndRef.current(sessionIdRef.current, duration);
        reportLearningRef.current(duration);
      }
      reportedDurationRef.current = 0;
      sessionIdRef.current = null;
      setSessionId(null);
      lastUploadTimeRef.current = 0;
    };
    // apiEnd and getCurrentDuration are intentionally omitted: they come
    // through shadow-refs (apiEndRef, getCurrentDurationRef) so the cleanup
    // can read the latest versions without re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey, label]);

  const getSessionId = useCallback(() => sessionIdRef.current, []);

  return { sessionId, getSessionId, start, upload, end };
}
