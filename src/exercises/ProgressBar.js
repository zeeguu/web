import * as s from "./ProgressBar.sc";
function percentageDone(index, total) {
  var p = Math.floor((index / total) * 100);
  return p;
}

export default function ProgressBar({ index, total, clock }) {
  return (
    <s.ProgressBar>
      <div className="progressModule">
        <div className="ex-progress">
          <div
            id="ex-bar"
            style={{ width: percentageDone(index, total) + "%" }}
          ></div>
          {clock}
        </div>
      </div>
    </s.ProgressBar>
  );
}
