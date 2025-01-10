import * as s from "./LevelIndicator.sc.js";
import LevelIndicatorBar from "./LevelIndicatorBar.js";
import LevelIndicatorCircle from "./LevelIndicatorCircle.js";

export default function LevelIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isHidden,
}) {
  const totalLearningStages = 5; // 4 levels + 1 for learned stage
  const coolingIntervalsPerLevel = 3; // cooling intervals 0, 1, and 2
  const levelsInPercent = 25; //100% bar width divided by 4 levels

  const { cooling_interval, is_last_in_cycle, level } = bookmark;

  const newBookmark = level === 0 && cooling_interval === null && !isHidden;
  const bookmarkMovesToNextLevel = is_last_in_cycle && userIsCorrect;

  return (
    <s.LevelIndicator isHidden={isHidden}>
      <div className="level-indicator">
        <LevelIndicatorBar
          totalLearningStages={totalLearningStages}
          level={level}
          cooling_interval={cooling_interval}
          userIsWrong={userIsWrong}
          bookmarkMovesToNextLevel={bookmarkMovesToNextLevel}
          newBookmark={newBookmark}
          isHidden={isHidden}
          userIsCorrect={userIsCorrect}
          levelsInPercent={levelsInPercent}
          coolingIntervalsPerLevel={coolingIntervalsPerLevel}
        />
        <LevelIndicatorCircle
          totalLearningStages={totalLearningStages}
          userIsWrong={userIsWrong}
          bookmarkMovesToNextLevel={bookmarkMovesToNextLevel}
          newBookmark={newBookmark}
          bookmark={bookmark}
        />
      </div>
    </s.LevelIndicator>
  );
}
