import {useEffect, useState} from "react";
import {useIdleTimer} from "react-idle-timer";

export default function useActivityTimer(activityUploaderFunction) {
    const [activeSessionDuration, setActiveSessionDuration] = useState(1);

    const [clockActive, setClockActive] = useState(true);

    const [activityOver, setActivityOver] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            let newValue = clockActive & !activityOver
                ? activeSessionDuration + 1
                : activeSessionDuration;
            setActiveSessionDuration(newValue);
        }, 1000);

        // if we have an activity uploader function, we will upload the activity every 10 seconds if the clock is active
        if (
            activityUploaderFunction &&
            clockActive &&
            activeSessionDuration % 10 === 0
        ) {
            activityUploaderFunction();
        }

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

    useEffect(() => {
        const handleFocus = () => {
            if (!activityOver) {
                setClockActive(true);
            }
        };

        const handleBlur = () => {
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
