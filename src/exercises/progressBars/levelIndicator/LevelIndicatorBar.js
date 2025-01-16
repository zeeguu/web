import { useEffect, useState } from "react";

export default function LevelIndicatorBar({
  isHidden,
  newBookmark,
  userIsCorrect,
  userIsWrong,
  levelsInPercent,
  numberOfCoolingIntervalsPerLevel,
  totalLearningStages,
  bookmark,
}) {
  const { cooling_interval, level, is_last_in_cycle } = bookmark;
  // Normalize level and cooling_interval to handle null values the first time a bookmark is practiced
  const normalizedLevel = level ? level : 1;
  const normalizedCoolingInterval = cooling_interval ?? 0;

  const initialProgressWithinLevel =
    normalizedCoolingInterval / numberOfCoolingIntervalsPerLevel;

  const initialProgressBarWidth =
    isHidden || newBookmark
      ? `0%`
      : `${((normalizedLevel - 1) / (totalLearningStages - 1)) * 100 + initialProgressWithinLevel * levelsInPercent}%`;

  const [progressBarWidth, setProgressBarWidth] = useState(
    initialProgressBarWidth,
  );

  useEffect(() => {
    const calculateProgressWithinLevel = userIsCorrect
      ? (normalizedCoolingInterval + 1) / numberOfCoolingIntervalsPerLevel
      : userIsWrong && normalizedCoolingInterval === 0
        ? initialProgressBarWidth
        : userIsWrong
          ? (normalizedCoolingInterval - 1) / numberOfCoolingIntervalsPerLevel
          : initialProgressBarWidth;

    const calculateProgressBarWidth =
      is_last_in_cycle && userIsCorrect
        ? `${(normalizedLevel / (totalLearningStages - 1)) * 100}%`
        : `${((normalizedLevel - 1) / (totalLearningStages - 1)) * 100 + calculateProgressWithinLevel * levelsInPercent}%`;
    setProgressBarWidth(calculateProgressBarWidth);
  }, [
    userIsCorrect,
    userIsWrong,
    normalizedCoolingInterval,
    is_last_in_cycle,
    normalizedLevel,
    newBookmark,
    isHidden,
  ]);

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: progressBarWidth }} />
    </div>
  );
}
