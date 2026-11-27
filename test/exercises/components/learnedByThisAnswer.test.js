import { describe, it, expect } from "vitest";
import { learnedByThisAnswer } from "../../../src/exercises/components/TopWordProgress";
import { EXERCISE_TYPES } from "../../../src/exercises/ExerciseTypeConstants";

const aboutToBeLearned = { id: 1, from: "slå op", to: "to look up", is_about_to_be_learned: true, is_last_in_cycle: true };
const answered = {
  exerciseType: EXERCISE_TYPES.translateL2toL1,
  bookmark: aboutToBeLearned,
  message: "C",
  isCorrect: true,
  isExerciseOver: true,
};

describe("learnedByThisAnswer", () => {
  it("is true for a right answer to a word about to be learned", () => {
    expect(learnedByThisAnswer(answered)).toBe(true);
  });

  it("is false before the answer is in", () => {
    expect(learnedByThisAnswer({ ...answered, isExerciseOver: false })).toBe(false);
  });

  it("is false for a wrong answer or a shown solution", () => {
    expect(learnedByThisAnswer({ ...answered, isCorrect: false })).toBe(false);
    expect(learnedByThisAnswer({ ...answered, isCorrect: null })).toBe(false);
  });

  it("is false for a word that is not about to be learned", () => {
    expect(learnedByThisAnswer({ ...answered, bookmark: { ...aboutToBeLearned, is_about_to_be_learned: false } })).toBe(false);
  });

  it("is false when the word needs a production answer and this one is not", () => {
    const needsProduction = { ...aboutToBeLearned, learning_needs_production: true };
    expect(learnedByThisAnswer({ ...answered, bookmark: needsProduction })).toBe(false);
    expect(
      learnedByThisAnswer({ ...answered, bookmark: needsProduction, exerciseType: EXERCISE_TYPES.flashcardWord }),
    ).toBe(true);
  });

  it("is never true for Match, which practices several words at once", () => {
    expect(learnedByThisAnswer({ ...answered, exerciseType: EXERCISE_TYPES.match })).toBe(false);
  });
});
