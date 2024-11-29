import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function useActivityTimer(activityUploaderFunction) {
  const [activityTimer, setActivityTimer] = useState(0);

  const [isTimerActive, setIsTimerActive] = useState(true);

  const [isActivityOver, setIsActivityOver] = useState(false);

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 30_000,
    eventsThrottle: 500,
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
      "focus",
    ],
  });
  function onIdle() {
    if (isTimerActive && activityUploaderFunction) {
      activityUploaderFunction();
    }
    setIsTimerActive(false);
  }

  function onActive() {
    setIsTimerActive(true);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      let newValue =
        isTimerActive & !isActivityOver ? activityTimer + 1 : activityTimer;
      setActivityTimer(newValue);
    }, 1000);

    // if we have an activity uploader function, we will upload the activity every 10 seconds if the clock is active
    if (activityUploaderFunction && isTimerActive && activityTimer % 10 === 0) {
      activityUploaderFunction();
    }

    return () => {
      clearInterval(interval);
    };
  }, [activityTimer, isTimerActive]);

  useEffect(() => {
    const handleFocus = () => {
      if (!isActivityOver) {
        setIsTimerActive(true);
      }
    };

    const handleBlur = () => {
      if (activityUploaderFunction && isTimerActive) {
        activityUploaderFunction();
      }
      setIsTimerActive(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  function onIdle() {
    if (isTimerActive && activityUploaderFunction) {
      activityUploaderFunction();
    }
    setIsTimerActive(false);
  }

  function onActive() {
    setIsTimerActive(true);
  }

  // active session duration is measured in seconds
  return [activityTimer, isTimerActive, setIsActivityOver];
}
