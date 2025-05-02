import { SOLUTION, WRONG } from "./ExerciseConstants";

export function correctnessBasedOnTries(message) {
  if (!message) return [false, false];
  const userIsCorrect = ["C", "TC", "TTC", "TTTC", "HC", "CC", "CCC"].includes(
    message,
  );
  const userIsWrong = message.includes(WRONG) || message.includes(SOLUTION);

  return [userIsCorrect, userIsWrong];
}
