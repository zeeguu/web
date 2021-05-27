import React, { useEffect, useState } from "react";
import * as s from "./StudentActivityBar.sc";

const StudentActivityBar = ({ student, readingTime, exerciseTime }) => {
  const [readingTimeString, setReadingTimeString] = useState("");
  const [exerciseTimeString, setExerciseTimeString] = useState("");

  useEffect(() => {
    const readingHours = Math.floor(readingTime / 3600);
    const readingMinutes = Math.ceil((readingTime / 60) % 60);
    readingHours < 1
      ? setReadingTimeString(readingMinutes + "m")
      : setReadingTimeString(readingHours + "h " + readingMinutes + "m");

    const exerciseHours = Math.floor(exerciseTime / 3600);
    const exerciseMinutes = Math.ceil((exerciseTime / 60) % 60);
    exerciseHours < 1
      ? setExerciseTimeString(exerciseMinutes + "m")
      : setExerciseTimeString(exerciseHours + "h " + exerciseMinutes + "m");
    //eslint-disable-next-line
  }, [student]);

  const setReadingCorners = () => {
    let readingCorners = "25px 0 0 25px";
    if (exerciseTime === 0) {
      readingCorners = "25px";
    }
    return readingCorners;
  };

  const setExerciseCorners = () => {
    let exerciseCorners = "0 25px 25px 0";
    if (readingTime === 0) {
      exerciseCorners = "25px";
    }
    return exerciseCorners;
  };

  const computedWidth = exerciseTime === 0 ? "0%" : 100 - student.reading_percentage + "%"
  //making sure we are not returning an activity bar if time is less than 3 minutes
  if (student.total_time < 240) { return null }
  return (
    <s.StudentActivityBar
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
          {readingTime > 120 ? readingTimeString : ""}
        </div>
        <div
          className="activity-bar"
          id="exercises"
          style={{
            width: computedWidth,
          }}
        >
          {/* Not showing the exercise time if it is less than 3 min */}
          {exerciseTime > 120 ? exerciseTimeString : ""}
        </div>
      </div>
    </s.StudentActivityBar>
  );
};
export default StudentActivityBar;
