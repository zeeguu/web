import * as s from "./LevelIndicator.sc.js";
import LevelIndicatorBar from "./LevelIndicatorBar.js";
import LevelIndicatorCircles from "./LevelIndicatorCircles.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression";
import strings from "../../../i18n/definitions";

export const LEVELS = 4;
export const COOLING_INTERVALS_PER_LEVEL = 3; // cooling intervals 0, 1, and 2
export const LEVELS_IN_PERCENT = 100 / LEVELS;
const TOTAL_CIRCLES = LEVELS + 1;

function handleBookmarkThatNeedsToBeMigrated(bookmark) {
  const COOLING_INTERVAL_TO_LEVEL_MAPPING = {
    0: 1,
    1: 1,
    2: 1,
    4: 2,
    8: 2,
  };

  let { cooling_interval, level, is_last_in_cycle, learning_cycle } = bookmark;

  if (level !== 0)
    return {
      cooling_interval: cooling_interval,
      level: level,
      is_last_in_cycle: is_last_in_cycle,
    };

  // the actual conversion
  let new_level = COOLING_INTERVAL_TO_LEVEL_MAPPING[cooling_interval] ?? 1;
  console.log(new_level);

  if (learning_cycle === 2) {
    new_level += 2;
    console.log(new_level);
  }

  let new_cooling_interval = 0;

  // extra bonus for receptive and cooling cycle 8
  if (learning_cycle === 1) {
    if (cooling_interval === 8) {
      new_level += 1;
    }
  }

  console.log(new_level);

  return {
    cooling_interval: new_cooling_interval,
    level: new_level,
    is_last_in_cycle: is_last_in_cycle,
  };
}

const GrayedOutIndicator = (
  <s.LevelIndicator isHidden={true}>
    <div className="level-indicator">
      <LevelIndicatorBar isHidden={true} />
      <LevelIndicatorCircles
        totalLearningStages={TOTAL_CIRCLES}
        levelInProgress={0}
      />
    </div>
  </s.LevelIndicator>
);

export default function LevelIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isGreyedOutBar,
}) {
  if (bookmark === undefined) {
    return GrayedOutIndicator;
  }

  // when we create a new bookmark, the level is automatically set to zero
  // (for backwards compatibility we also set all the levels to zero)
  const isNewBookmark =
    bookmark.level === 0 && bookmark.cooling_interval === null;

  let { cooling_interval, level, is_last_in_cycle } =
    handleBookmarkThatNeedsToBeMigrated(bookmark);

  const shouldBlink = cooling_interval === 0 && userIsWrong;

  // update the level and cooling interval based on the user correctness
  // these variables are defined only after the user has attempted a solution
  if (userIsCorrect) {
    cooling_interval = cooling_interval + 1;
    if (cooling_interval === COOLING_INTERVALS_PER_LEVEL) {
      level += 1;
      cooling_interval = 0;
    }
  }
  if (userIsWrong && cooling_interval > 0) {
    cooling_interval = cooling_interval - 1;
  }

  return (
    <s.LevelIndicator isGreyedOutBar={isGreyedOutBar}>
      <div className="level-indicator">
        <LevelIndicatorBar
          isHidden={isHidden}
          cooling_interval={cooling_interval}
          level={level}
        />
        <LevelIndicatorCircles
          totalLearningStages={TOTAL_CIRCLES}
          levelCompleted={is_last_in_cycle && userIsCorrect}
          levelIsBlinking={shouldBlink}
          showNewNotification={isNewBookmark}
          levelInProgress={level}
          tooltipText={
            isBookmarkExpression(bookmark)
              ? strings.newExpressionExercisesTooltip
              : strings.newWordExercisesTooltip
          }
        />
      </div>
    </s.LevelIndicator>
  );
}
