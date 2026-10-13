import { useEffect, useRef } from "react";

// Logs a session's clock stopping while its page still has focus (idle) and
// starting again (active, also the first action back after leaving), so the
// teacher's focus strip can tell a page left open from one being used.
// Stopping on blur is logged as lost focus by the page itself.
export default function useIdleLogging(isTimerActive, logIdle, logActive) {
  const wasActive = useRef(null);
  useEffect(() => {
    if (wasActive.current === null) {
      wasActive.current = isTimerActive;
      return;
    }
    if (wasActive.current && !isTimerActive && document.hasFocus()) logIdle();
    else if (!wasActive.current && isTimerActive) logActive();
    wasActive.current = isTimerActive;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire on the clock's changes only
  }, [isTimerActive]);
}
