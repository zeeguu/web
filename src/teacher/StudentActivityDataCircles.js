import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc";
import { StudentActivityDataCircleWrapper } from "./StudentActivityDataCircleWrapper.sc";

const StudentActivityDataCircles = ({
  length,
  difficulty,
  readingTime,
  translatedWords,
}) => {
  const data = [length, difficulty, readingTime, translatedWords];
  return (
    <StudentActivityDataCircleWrapper>
      {data.map((prop) => (
        <StudentActivityDataCircle>{prop}</StudentActivityDataCircle>
      ))}
    </StudentActivityDataCircleWrapper>
  );
};

export default StudentActivityDataCircles;
