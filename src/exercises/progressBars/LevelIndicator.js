import { useEffect, useState } from "react";
import * as s from "./LevelIndicator.sc";
import CheckIcon from "@mui/icons-material/Check";

export default function LevelIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isHidden,
}) {
  const totalLevels = 5;
  const stagesPerLevel = 3;

  const { cooling_interval, is_last_in_cycle, level } = bookmark;

  const initialProgressWithinLevel = cooling_interval / stagesPerLevel;

  const initialProgressBarWidth = isHidden
    ? `0%`
    : `${((level - 1) / (totalLevels - 1)) * 100 + initialProgressWithinLevel * 25}%`;

  const [progressBarWidth, setProgressBarWidth] = useState(
    initialProgressBarWidth,
  );

  useEffect(() => {
    const updatedProgressWithinLevel = userIsCorrect
      ? (cooling_interval + 1) / stagesPerLevel
      : userIsWrong && cooling_interval === 0
        ? cooling_interval / stagesPerLevel
        : userIsWrong
          ? (cooling_interval - 1) / stagesPerLevel
          : cooling_interval / stagesPerLevel;

    const updatedProgressBarWidth = is_last_in_cycle
      ? `${(level / (totalLevels - 1)) * 100}%`
      : `${((level - 1) / (totalLevels - 1)) * 100 + updatedProgressWithinLevel * 25}%`;
    setProgressBarWidth(updatedProgressBarWidth);
  }, [userIsCorrect, userIsWrong, cooling_interval, is_last_in_cycle, level]);
  return (
    <s.LevelIndicator isHidden={isHidden}>
      <div className="level-indicator">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: progressBarWidth }}
          ></div>
          {Array.from({ length: totalLevels }).map((_, index) => {
            const circleClass =
              index === 0
                ? "level-circle filled"
                : index === level - 1 && cooling_interval === 0 && userIsWrong
                  ? "level-circle passed blink"
                  : index <= level - 1 ||
                      (index === level && is_last_in_cycle && userIsCorrect)
                    ? "level-circle passed "
                    : "level-circle upcoming";

            return (
              <div
                key={index}
                className={circleClass}
                style={{
                  left: `${(index / (totalLevels - 1)) * 100}%`,
                }}
              >
                {circleClass.includes("passed") ? (
                  <CheckIcon style={{ fontSize: "16px" }} />
                ) : index === 0 ? null : (
                  index
                )}
              </div>
            );
          })}
        </div>
      </div>
    </s.LevelIndicator>
  );
}
