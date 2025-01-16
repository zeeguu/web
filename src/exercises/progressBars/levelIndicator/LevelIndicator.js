import * as s from "./LevelIndicator.sc.js";
import LevelIndicatorBar from "./LevelIndicatorBar.js";
import LevelIndicatorCircles from "./LevelIndicatorCircles.js";

export default function LevelIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isHidden,
}) {
  const totalLearningStages = 5; // 4 levels + 1 for learned stage
  const numberOfCoolingIntervalsPerLevel = 3; // cooling intervals 0, 1, and 2
  const levelsInPercent = 25; //100% bar width divided by 4 levels

  const { cooling_interval, level } = bookmark;

  const newBookmark = level === 0 && cooling_interval === null && !isHidden;

  return (
    <s.LevelIndicator isHidden={isHidden}>
      <div className="level-indicator">
        <LevelIndicatorBar
          totalLearningStages={totalLearningStages}
          bookmark={bookmark}
          userIsWrong={userIsWrong}
          newBookmark={newBookmark}
          isHidden={isHidden}
          userIsCorrect={userIsCorrect}
          levelsInPercent={levelsInPercent}
          numberOfCoolingIntervalsPerLevel={numberOfCoolingIntervalsPerLevel}
        />
        <LevelIndicatorCircles
          totalLearningStages={totalLearningStages}
          userIsWrong={userIsWrong}
          newBookmark={newBookmark}
          bookmark={bookmark}
          userIsCorrect={userIsCorrect}
        />
      </div>
    </s.LevelIndicator>
  );
}
