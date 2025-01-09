import { useEffect, useState } from "react";
import * as s from "./LevelIndicator.sc";
import CheckIcon from "@mui/icons-material/Check";
import NotificationIcon from "../../components/NotificationIcon.js";
import isBookmarkExpression from "../../utils/misc/isBookmarkExpression.js";
import strings from "../../i18n/definitions.js";

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

  const initialProgressWithinLevel =
    cooling_interval / coolingIntervalsPerLevel;

  const initialProgressBarWidth =
    isHidden || newBookmark
      ? `0%`
      : `${((level - 1) / (totalLearningStages - 1)) * 100 + initialProgressWithinLevel * levelsInPercent}%`;

  const [progressBarWidth, setProgressBarWidth] = useState(
    initialProgressBarWidth,
  );

  useEffect(() => {
    const updatedProgressWithinLevel = userIsCorrect
      ? (cooling_interval + 1) / coolingIntervalsPerLevel
      : userIsWrong && cooling_interval === 0
        ? cooling_interval / coolingIntervalsPerLevel
        : userIsWrong
          ? (cooling_interval - 1) / coolingIntervalsPerLevel
          : cooling_interval / coolingIntervalsPerLevel;

    const updatedProgressBarWidth =
      is_last_in_cycle && userIsCorrect
        ? `${(level / (totalLearningStages - 1)) * 100}%`
        : `${((level - 1) / (totalLearningStages - 1)) * 100 + updatedProgressWithinLevel * levelsInPercent}%`;
    setProgressBarWidth(updatedProgressBarWidth);
  }, [userIsCorrect, userIsWrong, cooling_interval, is_last_in_cycle, level]);

  return (
    <s.LevelIndicator isHidden={isHidden}>
      <div className="level-indicator">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: progressBarWidth }}
          ></div>
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
        </div>
      </div>
    </s.LevelIndicator>
  );
}
