import * as s from "./ProgressBar.sc";
function percentageDone(index, total) {
  var p = Math.floor((index / total) * 100);
  return p;
}

export default function ProgressBar({ index, total }) {
  return (
    <s.ProgressBar>
      <div className="progressModule">
        <div className="ex-progress">
          <div
            id="ex-bar"
            style={{ width: percentageDone(index, total) + "%" }}
          ></div>
        </div>
      </div>
    </s.ProgressBar>
  );
}
