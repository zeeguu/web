import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc";
import { StudentActivityDataCircleWrapper } from "./StudentActivityDataCircleWrapper.sc";

const StudentActivityDataCircles = ({
  length,
  difficulty,
  readingTime,
  translatedWords,
  isFirst,
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

  return (
    <StudentActivityDataCircleWrapper isFirst={isFirst}>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {" "}
            Text <br />
            level{" "}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {difficulty}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {" "}
            Text <br />
            length{" "}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {length}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {" "}
            Reading <br />
            time{" "}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {readingTimeString}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {" "}
            Translated <br />
            words{" "}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {translatedWords}
        </StudentActivityDataCircle>
      </div>
    </StudentActivityDataCircleWrapper>
  );
};

export default StudentActivityDataCircles;
