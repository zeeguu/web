import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function useActivityTimer() {
  const [activeSessionDuration, setActiveSessionDuration] = useState(1);

  const [clockActive, setClockActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      let newValue = clockActive
        ? activeSessionDuration + 1
        : activeSessionDuration;
      setActiveSessionDuration(newValue);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [activeSessionDuration, clockActive]);

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 30_000,
    throttle: 500,
  });

  window.addEventListener("focus", function () {
    setClockActive(true);
  });

  window.addEventListener("blur", function () {
    setClockActive(false);
  });

  function onIdle() {
    setClockActive(false);
  }

  function onActive() {
    setClockActive(true);
  }

  // active session duration is measured in seconds
  return [activeSessionDuration, clockActive, setClockActive];
}
