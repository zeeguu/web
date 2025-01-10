import CheckIcon from "@mui/icons-material/Check";
import NotificationIcon from "../../../components/NotificationIcon.js";
import isBookmarkExpression from "../../../utils/misc/isBookmarkExpression.js";
import strings from "../../../i18n/definitions.js";

export default function LevelIndicatorCircle({
  totalLearningStages,
  userIsWrong,
  bookmarkMovesToNextLevel,
  newBookmark,
  bookmark,
}) {
  const { cooling_interval, level } = bookmark;

  return (
    <>
      {Array.from({ length: totalLearningStages }).map((_, index) => {
        const circleClass =
          index === 0
            ? "level-circle filled"
            : index === level - 1 && cooling_interval === 0 && userIsWrong
              ? "level-circle passed blink"
              : index <= level - 1 ||
                  (index === level && bookmarkMovesToNextLevel)
                ? "level-circle passed "
                : "level-circle upcoming";

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
