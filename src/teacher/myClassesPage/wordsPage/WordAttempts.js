import { shortFormattedDate } from "../../sharedComponents/FormattedDate";
import ExerciseType from "../exercisesPage/ExerciseType";
import { AttemptIcons } from "../exercisesPage/AttemptIcons";
import * as s from "./WordAttempts.sc";

// A word's exercise attempts, as the old Exercises tab listed them: when,
// which kind of exercise, and how it went (one icon per try).
export default function WordAttempts({ attempts }) {
  if (!attempts || attempts.length === 0) return null;
  return (
    <s.WordAttempts>
      {attempts.map((attempt, idx) => (
        <s.Attempt key={idx}>
          <span className="date">{shortFormattedDate(attempt.time)}</span>
          <ExerciseType source={attempt.source} />
          <AttemptIcons attemptString={attempt.outcome} />
        </s.Attempt>
      ))}
    </s.WordAttempts>
  );
}
