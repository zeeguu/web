import { useEffect } from "react";
import * as s from "./LevelIndicator.sc.js";
import LevelIndicatorBar from "./LevelIndicatorBar.js";
import LevelIndicatorCircles from "./LevelIndicatorCircles.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression";
import strings from "../../../i18n/definitions";
import Feature from "../../../features/Feature.js";
import { predictAfterAnswer } from "./predictAfterAnswer";

export { COOLING_INTERVALS_PER_LEVEL } from "./predictAfterAnswer";
export const LEVELS = 4;
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

  if (learning_cycle === 2) {
    new_level += 2;
  }

  let new_cooling_interval = 0;

  // extra bonus for receptive and cooling cycle 8
  if (learning_cycle === 1) {
    if (cooling_interval === 8) {
      new_level += 1;
    }
  }

  return {
    cooling_interval: new_cooling_interval,
    level: new_level,
    is_last_in_cycle: is_last_in_cycle,
  };
}

const GrayedOutIndicator = (
  <s.LevelIndicator isGreyedOutBar={true}>
    <div className="level-indicator">
      <LevelIndicatorBar isGreyedOutBar={true} />
      <LevelIndicatorCircles
        totalLearningStages={TOTAL_CIRCLES}
        levelInProgress={0}
      />
    </div>
  </s.LevelIndicator>
);

export default function LevelIndicator({
  bookmark,
  message,
  userIsWrong,
  isGreyedOutBar,
}) {
  if (bookmark === undefined || bookmark === null) {
    return GrayedOutIndicator;
  }

  // when we create a new bookmark, the level is automatically set to zero
  // (for backwards compatibility we also set all the levels to zero)
  const isNewBookmark =
    bookmark.level === 0 && bookmark.cooling_interval === null;

  const before = handleBookmarkThatNeedsToBeMigrated(bookmark);

  const shouldBlink = before.cooling_interval === 0 && userIsWrong;

  // the level and step once the api has scheduled this answer (no change
  // before the learner has answered)
  const { cooling_interval, level } = predictAfterAnswer({
    level: before.level,
    cooling_interval: before.cooling_interval,
    message,
    fastProgression: Feature.fast_progression(),
  });
  const levelCompleted = level > before.level;

  // Dispatch event when user first makes any progress on a word
  // This shows the Learning Levels onboarding on first exercise completion
  useEffect(() => {
    if (level > 0 || cooling_interval > 0) {
      window.dispatchEvent(new CustomEvent("zeeguu-word-level-shown"));
    }
  }, [level, cooling_interval]);

  return (
    <s.LevelIndicator isGreyedOutBar={isGreyedOutBar}>
      <div className="level-indicator">
        <LevelIndicatorBar
          isGreyedOutBar={isGreyedOutBar}
          cooling_interval={cooling_interval}
          level={level}
        />
        <LevelIndicatorCircles
          totalLearningStages={TOTAL_CIRCLES}
          levelCompleted={levelCompleted}
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
