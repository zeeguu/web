import * as s from "./exerciseTypes/Exercise.sc";

export default function OutOfWordsMessage({ goBackAction }) {
  return (
    <s.Exercise>
      <div className="contextExample">
        <br />
        <br />

        <h2>Nothing more to study at the moment :)</h2>

        <br />
        <br />
        <p>
          Words are scheduled for exercises according to spaced-repetition principles and you already practiced the
          words that were due at this moment 🎉
        </p>
      </div>
    </s.Exercise>
  );
}
