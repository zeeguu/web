import { useState } from "react";

export default function useSubSessionTimer(activeSessionDuration) {
  // active session duration is measured in seconds
  // The DB stored the exercise time in ms we need to convert it
  // to MS.
  const [subSessionStart] = useState(activeSessionDuration);

  function getCurrentSubSessionDuration(time_unit = "s") {
    let timeDiff = activeSessionDuration - subSessionStart;
    switch (time_unit) {
      case "ms":
        return timeDiff * 1000;
      case "s":
      default:
        return timeDiff;
    }
  }

  return [getCurrentSubSessionDuration];
}
