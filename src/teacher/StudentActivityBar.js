import React, { useEffect, useState } from "react";
import { convertTimeForActivityBar, timeExplanation } from "./FormatedTime";
import * as s from "./StudentActivityBar.sc";
import { StyledTooltip } from "./StyledTooltip.sc";

const StudentActivityBar = ({ student, isFirst }) => {
  const [readingTimeString, setReadingTimeString] = useState("");
  const [exerciseTimeString, setExerciseTimeString] = useState("");

  useEffect(() => {
    convertTimeForActivityBar(student.reading_time, setReadingTimeString);
    convertTimeForActivityBar(student.exercise_time, setExerciseTimeString);
  }, [student]);

  const setReadingCorners = () => {
    let readingCorners = "25px 0 0 25px";
    if (student.exercise_time === 0) {
      readingCorners = "25px";
    }
    return readingCorners;
  };

  const setExerciseCorners = () => {
    let exerciseCorners = "0 25px 25px 0";
    if (student.reading_time === 0) {
      exerciseCorners = "25px";
    }
    return exerciseCorners;
  };

  const computedWidth = 100 - student.reading_percentage + "%";

  if (student.total_time === 0) {
    return null;
  }
  
  return (
    <s.StudentActivityBar
      isFirst={isFirst}
      readingCorners={() => setReadingCorners()}
      exerciseCorners={() => setExerciseCorners()}
    >
      <StyledTooltip label={timeExplanation(student)}>
      <div
        className="activity-bar"
        style={{
          width: student.normalized_activity_proportion + "%",
        }}
      >
        <div
          className="activity-bar"
          id="reading"
          style={{
            width: student.reading_percentage + "%",
          }}
        >
          <p style={{ fontSize: "small", marginTop: "20px" }}>
            {readingTimeString}
          </p>
        </div>
        <div
          className="activity-bar"
          id="exercises"
          style={{
            width: computedWidth,
          }}
        >
          <p style={{ fontSize: "small", marginTop: "20px" }}>
            {exerciseTimeString}
          </p>
        </div>
      </div>
      </StyledTooltip>
    </s.StudentActivityBar>
  );
};
export default StudentActivityBar;
