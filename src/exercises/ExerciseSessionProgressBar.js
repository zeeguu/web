import * as s from "./ExerciseSessionProgressBar.sc";
function percentageDone(index, total) {
  var p = Math.floor((index / total) * 100);
  return p;
}

export default function ExerciseSessionProgressBar({ index, total, clock }) {
  return (
    <s.ExerciseSessionProgressBar>
      <div className="progressModule">
        <div className="ex-progress">
          <div
            id="ex-bar"
            style={{ width: percentageDone(index, total) + "%" }}
          ></div>
          {clock}
        </div>
      </div>
    </s.ExerciseSessionProgressBar>
  );
}
