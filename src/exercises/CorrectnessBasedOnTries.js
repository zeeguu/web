import { SOLUTION, WRONG } from "./ExerciseConstants";

export function correctnessBasedOnTries(message) {
  if (!message) return [false, false];
  // "A": another word that fits as well (judge_cloze_alternative), after the
  // same help as "HC"/"TC". Mirrors ExerciseOutcome.alternative_outcomes.
  const userIsCorrect = ["C", "TC", "TTC", "TTTC", "HC", "CC", "CCC", "A", "HA", "TA", "TTA", "TTTA"].includes(
    message,
  );
  const userIsWrong = message.includes(WRONG) || message.includes(SOLUTION);

  return [userIsCorrect, userIsWrong];
}

// First try, no hint, no translation: the only answer fast progression counts.
export function isCleanAnswer(message) {
  return message === "C";
}
