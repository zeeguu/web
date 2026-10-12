import { LEVELS, COOLING_INTERVALS_PER_LEVEL, LEVELS_IN_PERCENT } from "./LevelIndicator";

export default function LevelIndicatorBar({ isGreyedOutBar, cooling_interval, level, lostCoolingIntervals = 0 }) {
  const progressWithinLevel = cooling_interval / COOLING_INTERVALS_PER_LEVEL;

  const progressBarWidth = isGreyedOutBar ? 0 : ((level - 1) / LEVELS) * 100 + progressWithinLevel * LEVELS_IN_PERCENT;

  // Orange bar shows total progress (actual + lost)
  const totalProgressWidth = isGreyedOutBar
    ? 0
    : ((level - 1) / LEVELS) * 100 +
      ((cooling_interval + lostCoolingIntervals) / COOLING_INTERVALS_PER_LEVEL) * LEVELS_IN_PERCENT;

  return (
    <div className="progress-bar">
      {lostCoolingIntervals > 0 && (
        <div
          className="lost-section"
          style={{
            width: `${totalProgressWidth}%`,
            left: `0`,
          }}
        />
      )}
      <div className="progress-fill" style={{ width: `${progressBarWidth}%` }} />
    </div>
  );
}
