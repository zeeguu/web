import CheckIcon from "@mui/icons-material/Check";
import NotificationIcon from "../../../components/NotificationIcon.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import strings from "../../../i18n/definitions.js";
import SchoolIcon from "@mui/icons-material/School";

export default function LevelIndicatorCircles({
  totalLearningStages,
  userIsWrong,
  newBookmark,
  bookmark,
  userIsCorrect,
}) {
  const { cooling_interval, level, is_last_in_cycle } = bookmark;
  const bookmarkMovesToNextLevel = is_last_in_cycle && userIsCorrect;
  const bookmarkStaysAtCurrentLevel = cooling_interval === 0 && userIsWrong;
  const maxLevel = 4;

  function getCircleClass(
    index,
    level,
    bookmarkStaysAtCurrentLevel,
    bookmarkMovesToNextLevel,
  ) {
    if (index === 0) {
      return "level-circle filled";
    } else if (index === level - 1 && bookmarkStaysAtCurrentLevel) {
      return "level-circle passed blink";
    } else if (index === maxLevel) {
      return "level-circle final";
    } else if (index === maxLevel && bookmarkMovesToNextLevel) {
      return "level-circle final learned";
    } else if (
      index <= level - 1 ||
      (index === level && bookmarkMovesToNextLevel)
    ) {
      return "level-circle passed";
    } else {
      return "level-circle upcoming";
    }
  }

  function getCircleIcon(index) {
    if (index === 0) {
      return null;
    } else if (index === maxLevel) {
      return <SchoolIcon className="school-icon" />;
    } else {
      return <CheckIcon style={{ fontSize: "14px" }} />;
    }
  }

  return (
    <>
      {Array.from({ length: totalLearningStages }).map((_, index) => {
        const circleClass = getCircleClass(
          index,
          level,
          bookmarkStaysAtCurrentLevel,
          bookmarkMovesToNextLevel,
        );

        return (
          <div
            key={index}
            className={circleClass}
            style={{
              left: `${(index / (totalLearningStages - 1)) * 100}%`,
            }}
          >
            {getCircleIcon(index)}
            {newBookmark && circleClass === "level-circle filled" && (
              <NotificationIcon
                style={{
                  marginRight: "-2.2em",
                  top: "-1em",
                  left: "0.2em",
                }}
                text={"New!"}
                tooltipText={
                  isBookmarkExpression(bookmark)
                    ? strings.newExpressionExercisesTooltip
                    : strings.newWordExercisesTooltip
                }
              />
            )}
          </div>
        );
      })}
    </>
  );
}
