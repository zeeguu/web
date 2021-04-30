import React, { useEffect, useState } from "react";
import * as s from "./ProgressBar.sc";

const ProgressBar = ({
  api,
  student
}) => {
  //in case the user hasn't read anything, make the learning proportion 50 %
  student.learning_proportion = student.learning_proportion === 0 ? 50 : student.learning_proportion;

  const [readingTime, setReadingTime] = useState("")
  const [exerciseTime, setExerciseTime] = useState("")

/*   const readH=Math.floor(student.reading_time / 3600)
  const readM=Math.ceil((student.reading_time / 60) % 60)
  setReadingTime(readH + "h "+ readM + "m")
 
  const exerciseH=Math.floor(student.exercises_done / 3600)
  const exerciseM=Math.ceil((student.exercises_done / 60) % 60)
  setExerciseTime(exerciseH + "h "+ exerciseM + "m") */

  
  useEffect(()=>{
      api.getUserActivityByDay(res => console.log(res))
      const readH=Math.floor(student.reading_time / 3600)
      const readM=Math.ceil((student.reading_time / 60) % 60)
      setReadingTime(readH + "h "+ readM + "m")
     
      const exerciseH=Math.floor(student.exercises_done / 3600)
      const exerciseM=Math.ceil((student.exercises_done / 60) % 60)
      setExerciseTime(exerciseH + "h "+ exerciseM + "m")
      // eslint-disable-next-line
  },[])

  return (
      <s.ProgressBar>
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
          width: student.learning_proportion + "%",
        }}
      >{student.reading_time>120 ? readingTime: ""}</div>
      <div
        className="activity-bar"
        id="exercises"
        style={{
          width: 100 - student.learning_proportion + "%",
        }}
      >{student.exercises_done >120 ? exerciseTime : ""}</div>
    </div>
    </s.ProgressBar>
  );
};
export default ProgressBar;
