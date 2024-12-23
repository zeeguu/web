import { getStaticPath } from "../../utils/misc/staticPath";
import strings from "../../i18n/definitions";
import { random } from "../../utils/basic/arrays";
import { useState } from "react";

const ENCOURAGEMENT = [
  strings.correctExercise1,
  strings.correctExercise2,
  strings.correctExercise3,
];

export default function CorrectMessage({ className, info }) {
  const [encouragementMessage, setEncouragementMessage] = useState(
    random(ENCOURAGEMENT),
  );
  return (
    <div className={className}>
      <img
        src={getStaticPath("icons", "zeeguu-icon-correct.png")}
        alt="Correct Icon"
      />
      <p>
        <b>{encouragementMessage + " " + info}</b>
      </p>
    </div>
  );
}
