import * as s from "./ExerciseSessionProgressBar.sc";
function percentageDone(index, total) {
  var p = Math.floor((index / total) * 100);
  return p;
}

export default function ExerciseSessionProgressBar({ index, total }) {
  return (
    <s.ExerciseSessionProgressBar>
      <progress 
        style={{ 
          margin: "0px", 
          marginBottom: "0.5rem", 
          marginTop: "0.5rem",
          width: "100%" 
        }} 
        value={percentageDone(index, total) / 100} 
      />
    </s.ExerciseSessionProgressBar>
  );
}
