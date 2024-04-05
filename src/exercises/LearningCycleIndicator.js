import React from "react";

export default function LearningCycleIndicator({ learningCycle, coolingInterval }) {
  
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

  const getGreenBars = () => {
    if (coolingInterval >= 11520) return 4;
    if (coolingInterval >= 5760) return 3;
    if (coolingInterval >= 2880) return 2;
    if (coolingInterval >= 1440) return 1;
    return 0;
  }
  
  const getBarColor = (index) => {
    if (index < coolingInterval) return 'green';
    if (index === coolingInterval) return 'yellow';
    return 'grey';
  }

  return (
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
  );
}