import React from "react";
import { useState, useEffect } from "react";

export default function LearningCycleIndicator({ 
  learningCycle, 
  coolingInterval, 
  isCorrect,
  message 
}) {
  
  const [userIsCorrect, setUserIsCorrect] = useState(false);
  const [userIsWrong, setUserIsWrong] = useState(false);

  useEffect(() => {
    const userIsCorrect = ["C", "TC", "TTC", "TTTC", "HC"].includes(message);
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

  const getBarColor = (index) => {
    if (index < coolingInterval / 1440) return 'green';
    if (index === coolingInterval / 1440) {
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
          <div className="learningCycleIcon">
            <img 
              src={getLearningCycleIcon()} 
              alt={`${learningCycleEnum[learningCycle]}-icon`} 
              style={{height: '2.5em', width: '2.5em'}}/>
          </div>
          <div className="cooling-bars">
            {[...Array(4)].map((_, index) => (
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