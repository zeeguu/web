import {
  LEVELS,
  COOLING_INTERVALS_PER_LEVEL,
  LEVELS_IN_PERCENT,
} from "./LevelIndicator";

export default function LevelIndicatorBar({
  isGreyedOutBar,
  cooling_interval,
  level,
}) {
  const progressWithinLevel = cooling_interval / COOLING_INTERVALS_PER_LEVEL;

  const progressBarWidth = isGreyedOutBar
    ? 0
    : ((level - 1) / LEVELS) * 100 + progressWithinLevel * LEVELS_IN_PERCENT;

  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${progressBarWidth}%` }}
      />
    </div>
  );
}
