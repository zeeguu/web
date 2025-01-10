import { useEffect, useState } from "react";

export default function LevelIndicatorBar({
  cooling_interval,
  isHidden,
  newBookmark,
  userIsCorrect,
  userIsWrong,
  is_last_in_cycle,
  level,
  levelsInPercent,
  coolingIntervalsPerLevel,
  totalLearningStages,
}) {
  const initialProgressWithinLevel =
    cooling_interval / coolingIntervalsPerLevel;

  const initialProgressBarWidth =
    isHidden || newBookmark
      ? `0%`
      : `${((level - 1) / (totalLearningStages - 1)) * 100 + initialProgressWithinLevel * levelsInPercent}%`;

  const [progressBarWidth, setProgressBarWidth] = useState(
    initialProgressBarWidth,
  );

  useEffect(() => {
    const updatedProgressWithinLevel = userIsCorrect
      ? (cooling_interval + 1) / coolingIntervalsPerLevel
      : userIsWrong && cooling_interval === 0
        ? cooling_interval / coolingIntervalsPerLevel
        : userIsWrong
          ? (cooling_interval - 1) / coolingIntervalsPerLevel
          : cooling_interval / coolingIntervalsPerLevel;

    const updatedProgressBarWidth =
      is_last_in_cycle && userIsCorrect
        ? `${(level / (totalLearningStages - 1)) * 100}%`
        : `${((level - 1) / (totalLearningStages - 1)) * 100 + updatedProgressWithinLevel * levelsInPercent}%`;
    setProgressBarWidth(updatedProgressBarWidth);
  }, [userIsCorrect, userIsWrong, cooling_interval, is_last_in_cycle, level]);

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: progressBarWidth }} />
    </div>
  );
}
