import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function useActivityTimer(activityUploaderFunction) {
  const [activeSessionDuration, setActiveSessionDuration] = useState(0);

  const [clockActive, setClockActive] = useState(true);

  const [activityOver, setActivityOver] = useState(false);

  useEffect(() => {
    console.log("STARTING UP ACTIVITY INTERVAL");
    console.log(clockActive, activityOver, activeSessionDuration);
    const interval = setInterval(() => {
      console.log("RUNNING INTERVAL");
      let newValue =
        clockActive & !activityOver
          ? activeSessionDuration + 1
          : activeSessionDuration;
      setActiveSessionDuration(newValue);
    }, 1000);

    // if we have an activity uploader function, we will upload the activity every 10 seconds if the clock is active
    if (
      activityUploaderFunction &&
      clockActive &&
      activeSessionDuration % 10 === 0 &&
      activeSessionDuration !== 0
    ) {
      activityUploaderFunction();
    }

    return () => {
      console.log("CLEARING INTERVAL");
      clearInterval(interval);
    };
  }, [activeSessionDuration, clockActive]);

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 30_000,
    throttle: 500,
  });

  useEffect(() => {
    console.log("STARTING UP ACTIVITY TIMER");
    const handleFocus = () => {
      console.log("Running is Focus!");
      if (!activityOver) {
        setClockActive(true);
      }
    };

    const handleBlur = () => {
      console.log("Running is Blurred!");
      if (activityUploaderFunction && clockActive) {
        activityUploaderFunction();
      }
      setClockActive(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  function onIdle() {
    if (clockActive && activityUploaderFunction) {
      activityUploaderFunction();
    }
    setClockActive(false);
  }

  function onActive() {
    setClockActive(true);
  }

  // active session duration is measured in seconds
  return [activeSessionDuration, clockActive, setActivityOver];
}
