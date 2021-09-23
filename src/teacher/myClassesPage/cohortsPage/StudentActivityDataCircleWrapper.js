import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import strings from "../../../i18n/definitions";
import { convertTime } from "../../sharedComponents/FormattedTime";
import { StudentActivityDataCircle } from "../../styledComponents/StudentActivityDataCircle.sc";
import * as s from "../../styledComponents/StudentActivityDataCircleWrapper.sc";

const StudentActivityDataCircles = ({
  length,
  difficulty,
  readingTime,
  translatedWords,
  isFirst,
}) => {
  const [readingTimeString, setReadingTimeString] = useState("");

  useEffect(() => {
    convertTime(readingTime, setReadingTimeString);
    //eslint-disable-next-line
  }, []);

  return (
    <s.StudentActivityDataCircleWrapper isFirst={isFirst}>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {strings.text} <br />
            {strings.level}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {difficulty}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {strings.text} <br />
            {strings.lengthOnText}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {length}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {strings.readingTime} <br />
            {strings.time}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {readingTimeString}
        </StudentActivityDataCircle>
      </div>
      <div>
        {isFirst && (
          <p className="data-circle-title">
            {strings.translated} <br />
            {strings.wordsWithLowercase}
          </p>
        )}
        <StudentActivityDataCircle key={uuid()}>
          {translatedWords}
        </StudentActivityDataCircle>
      </div>
    </s.StudentActivityDataCircleWrapper>
  );
};

export default StudentActivityDataCircles;
