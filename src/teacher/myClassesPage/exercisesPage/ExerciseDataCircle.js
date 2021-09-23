import { StudentActivityDataCircle } from "../../styledComponents/StudentActivityDataCircle.sc";
import * as s from "../../styledComponents/ExerciseDataCircle.sc";

const ExerciseDataCircle = ({ circleText, circleData }) => {
  return (
    <s.StyledExerciseDataCircle>
      <div className="circle-text-wrapper">
        <p className="circle-width">{circleText}</p>
        <StudentActivityDataCircle className="data-circle-styling">
          {circleData}
        </StudentActivityDataCircle>
      </div>
    </s.StyledExerciseDataCircle>
  );
};
export default ExerciseDataCircle;
