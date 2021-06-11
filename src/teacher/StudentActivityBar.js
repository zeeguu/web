import React, { useEffect, useState } from "react";
import { convertTime } from "./FormatedTime";
import * as s from "./StudentActivityBar.sc";

const StudentActivityBar = ({ student, isFirst }) => {
  const [readingTimeString, setReadingTimeString] = useState("");
  const [exerciseTimeString, setExerciseTimeString] = useState("");


  useEffect(() => {
    convertTime(student.reading_time, setReadingTimeString)
    convertTime(student.exercises_done, setExerciseTimeString)

  }, [student]);

  const setReadingCorners = () => {
    let readingCorners = "25px 0 0 25px";
    if (student.exercises_done === 0) {
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

  const computedWidth = student.exercises_done === 0 ? "0%" : 100 - student.reading_percentage + "%"
  //making sure we are not returning an activity bar if time is less than 3 minutes
  if (student.total_time < 240) { return null }
  return (
    <s.StudentActivityBar
      isFirst={isFirst}
      readingCorners={() => setReadingCorners()}
      exerciseCorners={() => setExerciseCorners()}
    >
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
          {/* Not showing the reading time if it is less than 3 min */}
          {student.reading_time > 120 ? readingTimeString : ""}
        </div>
        <div
          className="activity-bar"
          id="exercises"
          style={{
            width: computedWidth,
          }}
        >
          {/* Not showing the exercise time if it is less than 3 min */}
          {student.exercises_done > 120 ? exerciseTimeString : ""}
        </div>
      </div>
    </s.StudentActivityBar>
  );
};
export default StudentActivityBar;
