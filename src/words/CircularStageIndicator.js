import React from "react";
import "./CircularStageIndicator.css";
import { blue600, blue900, zeeguuOrange } from "../components/colors";

const CircularStageIndicator = ({
  currentStage,
  stageProgression,
  maxSubstageProgression = 3,
  maxLevel = 4,
}) => {
  // Calculate progress (0 to 1)
  const totalSubstages = maxLevel * maxSubstageProgression;
  const currentProgress =
    (currentStage - 1) * maxSubstageProgression + (stageProgression - 1);
  const progressPercent = currentProgress / totalSubstages;

  // SVG circle math
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - circumference * progressPercent;

  return (
    <div className="stage-indicator-container">
      <svg
        className="stage-indicator"
        viewBox="0 0 40 40"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background circle */}
        <circle
          className="background-circle"
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="3"
        />

        {/* Progress circle */}
        <circle
          className="progress-circle"
          cx="20"
          cy="20"
          r="15"
          fill="none"
          stroke={blue900}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />

        {/* Stage number */}
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fill="#333"
          fontSize="14"
          fontWeight="bold"
        >
          L{currentStage}
        </text>
      </svg>
    </div>
  );
};
export default CircularStageIndicator;
