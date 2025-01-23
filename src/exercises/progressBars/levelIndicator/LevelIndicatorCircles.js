import CheckIcon from "@mui/icons-material/Check";
import NotificationIcon from "../../../components/NotificationIcon.js";
import SchoolIcon from "@mui/icons-material/School";

export default function LevelIndicatorCircles({
  totalLearningStages,
  showNewNotification,
  levelInProgress,
  levelCompleted,
  levelIsBlinking,
  tooltipText,
}) {
  const maxLevel = 4;

  function getCircleClass(index, level, levelIsBlinking, levelCompleted) {
    if (index === 0) {
      return "level-circle filled";
    } else if (index === level - 1 && levelIsBlinking) {
      return "level-circle passed blink";
    } else if (index === maxLevel) {
      return "level-circle final";
    } else if (index === maxLevel && levelCompleted) {
      return "level-circle final learned";
    } else if (index <= level - 1 || (index === level && levelCompleted)) {
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
          levelInProgress,
          levelIsBlinking,
          levelCompleted,
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
            {showNewNotification && circleClass === "level-circle filled" && (
              <NotificationIcon
                style={{
                  marginRight: "-2.2em",
                  top: "-1em",
                  left: "0.2em",
                }}
                text={"New!"}
                tooltipText={tooltipText}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
