import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function useActivityTimer() {
  const [secondsInCurrentSession, setSecondsInCurrentSession] = useState(1);

  const [clockActive, setClockActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      let newValue = clockActive
        ? secondsInCurrentSession + 1
        : secondsInCurrentSession;
      setSecondsInCurrentSession(newValue);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [secondsInCurrentSession, clockActive]);

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

  return [secondsInCurrentSession, clockActive];
}
