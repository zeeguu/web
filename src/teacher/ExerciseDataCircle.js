import { StudentActivityDataCircle } from "./StudentActivityDataCircle.sc";

const ExerciseDataCircle = ({ circleText, circleData }) => {
  return (
    <div className="circle-text-wrapper">
      <p style={{ width: 90 }}>{circleText}</p>
      <StudentActivityDataCircle
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {circleData}
      </StudentActivityDataCircle>
    </div>
  );
};
export default ExerciseDataCircle;
