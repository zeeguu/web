import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc";
import { StudentActivityDataCircleWrapper } from "./StudentActivityDataCircleWrapper.sc";

const StudentActivityDataCircles = ({
  length,
  difficulty,
  readingTime,
  translatedWords,
}) => {
  const [readingTimeString, setReadingTimeString] = useState("");
  
  useEffect(() => {
    const readingHours = Math.floor(readingTime / 3600);
    const readingMinutes = Math.ceil((readingTime / 60) % 60);
    readingHours < 1
      ? setReadingTimeString(readingMinutes + "m")
      : setReadingTimeString(readingHours + "h " + readingMinutes + "m");
      //eslint-disable-next-line 
  }, []);

  const data = [difficulty, length, readingTimeString, translatedWords];
  return (
    <StudentActivityDataCircleWrapper>
      {data.map((prop) => (
        <StudentActivityDataCircle key={uuid()}>{prop}</StudentActivityDataCircle>
      ))}
    </StudentActivityDataCircleWrapper>
  );
};

export default StudentActivityDataCircles;
