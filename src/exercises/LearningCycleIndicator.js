import React from "react";
import { useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import strings from "../i18n/definitions";

export default function LearningCycleIndicator({ 
  bookmark,
  message 
}) {
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [userIsWrong, setUserIsWrong] = useState(false);

  let learningCycle = bookmark.learning_cycle;
  let coolingInterval = bookmark.cooling_interval;

  useEffect(() => {
    const userIsCorrect = ["C", "TC", "TTC", "TTTC", "HC", "CC", "CCC"].includes(message);
    setUserIsCorrect(userIsCorrect);
    const userIsWrong = message.includes("W")|| message.includes("S");
    setUserIsWrong(userIsWrong);
    console.log(message)
  }, [message]);


  const learningCycleEnum = Object.freeze({
    0: "not set",
    1: "receptive",
    2: "productive",
  });

  const coolingIntervalToBarCount = {
    0: 0,
    1440: 1,
    2880: 2,
    5760: 3,
    11520: 4,
  };

  const getLearningCycleIcon = () => {
    switch(learningCycleEnum[learningCycle]) {
      case "receptive":
        return '/static/icons/receptive-icon.png';
      case "productive":
        return '/static/icons/productive-icon.png';
      default:
        return null;
    }
  }

  const getTooltipContent = () => {
    switch(learningCycleEnum[learningCycle]) {
      case "receptive":
        return strings.receptiveTooltip;
      case "productive":
        return strings.productiveTooltip;
      default:
        return '';
    }
  }

  const getBarColor = (index) => {
    let barCount = coolingIntervalToBarCount[coolingInterval];
    if (index < barCount) return 'green';
    if (index === barCount) {
      if (userIsCorrect) return 'green';
      if (userIsWrong) return 'grey';
      return 'yellow';
    }
    return 'grey';
  }

  return (
    <>
      {learningCycleEnum[learningCycle] !== "not set" && (
        <>
          <Tooltip title={getTooltipContent()}>
            <div className="learningCycleIcon">
              <img 
                src={getLearningCycleIcon()} 
                alt={`${learningCycleEnum[learningCycle]}-icon`} 
                style={{height: '2.5em', width: '2.5em'}}/>
            </div>
          </Tooltip>
          <div className="cooling-bars">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className={`cooling-bar ${getBarColor(index)}`}
              ></div>
            ))}
          </div>
        </>
      )}
    </>
  );
}