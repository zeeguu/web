import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import strings from "../../i18n/definitions.js";
import { LEARNING_CYCLE_NAME } from "../ExerciseTypeConstants.js";
import { APP_DOMAIN } from "../../appConstants.js";
import NotificationIcon from "../../components/NotificationIcon.js";
import isBookmarkExpression from "../../utils/misc/isBookmarkExpression.js";

export default function LearningCycleIndicator({
  bookmark,
  userIsCorrect,
  userIsWrong,
  isHidden,
}) {
  let learningCycle = bookmark.learning_cycle;
  let coolingInterval = bookmark.cooling_interval;

  const getLearningCycleIcon = () => {
    if (isHidden) {
      return "/static/icons/active-icon-lightGrey.png";
    }
    switch (LEARNING_CYCLE_NAME[learningCycle]) {
      // If there is no learning cycle (it is a new word) treat as
      // receptive.
      case "not set":
      case "receptive":
        return "/static/icons/receptive-icon.png";
      case "productive":
        return "/static/icons/productive-icon.png";
      default:
        return null;
    }
  };

  const getTooltipContent = () => {
    switch (LEARNING_CYCLE_NAME[learningCycle]) {
      // If there is no learning cycle (it is a new word) treat as
      // receptive.
      case "not set":
      case "receptive":
        return strings.receptiveTooltip;
      case "productive":
        return strings.productiveTooltip;
      default:
        return "";
    }
  };

  const getBarProperties = (index) => {
    let color = "grey";
    let widthMultiplier = Math.pow(1.8, index);

    if (isHidden) {
      return { color, widthMultiplier };
    }

    const initialBarCountMapping = {
      0: 0,
      1: 1,
      2: 2,
      4: 3,
      8: 4,
    };

    let barCount = coolingInterval
      ? initialBarCountMapping[coolingInterval]
      : 0;

    if (userIsWrong) {
      if (barCount > 0) {
        barCount -= 1;
      } else {
        barCount = 0;
      }
    }

    if (index < barCount) {
      color = "green";
    } else if (index === barCount && userIsCorrect) {
      color = "greenCorrect";
    }
    return { color, widthMultiplier };
  };

  return (
    <>
      <div className="learningCycleIndicator">
        <div className="learningCycleIcon">
          <Tooltip title={getTooltipContent()}>
            <img
              src={APP_DOMAIN + getLearningCycleIcon()}
              alt={`${LEARNING_CYCLE_NAME[learningCycle]}-icon`}
              style={{ height: "2.5em", width: "2.5em" }}
            />
          </Tooltip>
          {coolingInterval === null && !isHidden && (
            <NotificationIcon
              style={{
                marginRight: "-2.2em",
                top: "-2em",
                left: "-0.8em",
              }}
              text={"New!"}
              tooltipText={
                isBookmarkExpression(bookmark)
                  ? strings.newExpressionExercisesTooltip
                  : strings.newWordExercisesTooltip
              }
            ></NotificationIcon>
          )}
        </div>

        <div className="cooling-bars">
          {[...Array(5)].map((_, index) => {
            const { color, widthMultiplier } = getBarProperties(index);
            return (
              <div
                key={index}
                className={`cooling-bar ${color}`}
                style={{ width: `${0.5 * widthMultiplier}em` }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
}
