import * as s from "./LevelIndicator.sc.js";
import LevelIndicatorBar from "./LevelIndicatorBar.js";
import LevelIndicatorCircles from "./LevelIndicatorCircles.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression";
import strings from "../../../i18n/definitions";

export const LEVELS = 4;
export const COOLING_INTERVALS_PER_LEVEL = 3; // cooling intervals 0, 1, and 2
export const LEVELS_IN_PERCENT = 100 / LEVELS;

export default function LevelIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isHidden,
}) {
  const totalCircles = LEVELS + 1;

  let { cooling_interval, level, is_last_in_cycle } = bookmark;
  console.log(bookmark);

  // const isNewBookmark = level === 0 && cooling_interval === null && !isHidden;
  // when we create a new bookmark, the level is automatically set to zero
  // for backwards compatibility we also set all the levels to zero
  const isNewBookmark = level === 0 && cooling_interval === null;

  // if the backend sent us a bookmark with level 0 that actually means
  // it's level 1, but was not exercised until now; so for the remaining
  // code level is going to actually be 1
  // the same story with the cooling interval; if it's null on the backend
  // the semantics is that it's actually 0
  level = level ? level : 1;
  cooling_interval = cooling_interval ?? 0;

  const bookmarkMovesToNextLevel = is_last_in_cycle && userIsCorrect;
  const bookmarkStaysAtCurrentLevel = cooling_interval === 0 && userIsWrong;

  return (
    <s.LevelIndicator isHidden={isHidden}>
      <div className="level-indicator">
        <LevelIndicatorBar
          isHidden={isHidden}
          cooling_interval={cooling_interval}
          level={level}
        />
        <LevelIndicatorCircles
          totalLearningStages={totalCircles}
          levelCompleted={bookmarkMovesToNextLevel}
          levelIsBlinking={bookmarkStaysAtCurrentLevel}
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
