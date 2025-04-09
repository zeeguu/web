import { useState } from "react";

export default function useSubSessionTimer(activeSessionDurationRef) {
  // active session duration is measured in seconds
  // The DB stored the exercise time in ms we need to convert it
  // to MS.
  const [subSessionStart, setSubSessionStart] = useState(
    activeSessionDurationRef,
  );

  function getCurrentSubSessionDuration(time_unit = "s") {
    let timeDiff = activeSessionDurationRef - subSessionStart;
    switch (time_unit) {
      case "ms":
        return timeDiff * 1000;
      case "s":
      default:
        return timeDiff;
    }
  }

  function resetSubSessionTimer() {
    console.log("Resetting to: ", activeSessionDurationRef);
    setSubSessionStart(activeSessionDurationRef);
  }

  return [getCurrentSubSessionDuration, resetSubSessionTimer];
}
