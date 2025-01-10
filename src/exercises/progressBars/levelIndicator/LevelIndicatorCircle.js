import CheckIcon from "@mui/icons-material/Check";
import NotificationIcon from "../../../components/NotificationIcon.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import strings from "../../../i18n/definitions.js";

export default function LevelIndicatorCircle({
  totalLearningStages,
  userIsWrong,
  newBookmark,
  bookmark,
  userIsCorrect,
}) {
  const { cooling_interval, level, is_last_in_cycle } = bookmark;
  const bookmarkMovesToNextLevel = is_last_in_cycle && userIsCorrect;
  const bookmarkStaysAtCurrentLevel = cooling_interval === 0 && userIsWrong;

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
    } else if (
      index <= level - 1 ||
      (index === level && bookmarkMovesToNextLevel)
    ) {
      return "level-circle passed";
    } else {
      return "level-circle upcoming";
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
            {circleClass.includes("passed") ? (
              <CheckIcon style={{ fontSize: "16px" }} />
            ) : index === 0 ? null : (
              index
            )}
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
