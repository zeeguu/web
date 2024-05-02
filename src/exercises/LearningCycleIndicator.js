import React from "react";
import { useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import strings from "../i18n/definitions";
import Feature from "../features/Feature";
import { logScaleToLinear } from "../utils/basic/logScaleToLinear";
import { ExerciseValidation } from "./ExerciseValidation";
import { learningCycleEnum } from "./ExerciseTypeConstants";
import { APP_DOMAIN } from "../i18n/appConstants.js";
import NotificationIcon from "../components/NotificationIcon";

export default function LearningCycleIndicator({ bookmark, message }) {
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [userIsWrong, setUserIsWrong] = useState(false);

  let learningCycle = bookmark.learning_cycle;
  let coolingInterval = bookmark.cooling_interval;
  useEffect(() => {
    const { userIsCorrect, userIsWrong } = ExerciseValidation(message);
    setUserIsCorrect(userIsCorrect);
    setUserIsWrong(userIsWrong);
  }, [message]);

  const getLearningCycleIcon = () => {
    switch (learningCycleEnum[learningCycle]) {
      case "receptive":
        return "/static/icons/receptive-icon.png";
      case "productive":
        return "/static/icons/productive-icon.png";
      default:
        return null;
    }
  };

  const getTooltipContent = () => {
    switch (learningCycleEnum[learningCycle]) {
      case "receptive":
        return strings.receptiveTooltip;
      case "productive":
        return strings.productiveTooltip;
      default:
        return "";
    }
  };

  const getBarProperties = (index) => {
    let barCount = logScaleToLinear(coolingInterval);
    let color = "grey";
    let widthMultiplier = Math.pow(1.8, index);

    if (index < barCount) {
      color = "green";
    } else if (index === barCount) {
      color = "yellow";
      if (userIsCorrect) {
        color = "green";
      } else if (userIsWrong) {
        color = "grey";
      }
    }
    return { color, widthMultiplier };
  };
  return (
    <>
      {Feature.merle_exercises() && (
        <div className="learningCycleIndicator">
          <Tooltip title={getTooltipContent()}>
            <div className="learningCycleIcon">
              <img
                src={APP_DOMAIN + getLearningCycleIcon()}
                alt={`${learningCycleEnum[learningCycle]}-icon`}
                style={{ height: "2.5em", width: "2.5em" }}
              />
              {coolingInterval === null && (
                <NotificationIcon
                  style={{ marginRight: "-2.2em", top: "-2em", left: "-0.8em" }}
                  text={"New!"}
                ></NotificationIcon>
              )}
            </div>
          </Tooltip>

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
      )}
    </>
  );
}
