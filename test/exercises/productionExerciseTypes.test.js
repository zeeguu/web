import { describe, it, expect } from "vitest";
import { PRODUCTION_EXERCISE_TYPES, canLearnWithThisExercise, EXERCISE_TYPES } from "../../src/exercises/ExerciseTypeConstants";
import { ALL_EXERCISES } from "../../src/exercises/exerciseSequenceTypes";
import { RECALL_MEANING, RECALL_WORD, FLASHCARD_MEANING, FLASHCARD_WORD } from "../../src/exercises/exerciseFamilies";

// The api's copy of the production list: ExerciseSource.PRODUCTION in
// zeeguu/core/model/exercise_source.py. If this test fails because the web's
// level-4 types changed, change the api's list in the same breath, or words of
// learners who practice production can no longer be learned.
const API_PRODUCTION = ["Cloze_L1_to_L2", "Spell_What_You_Hear", "Recall_L2W_from_L1W_no_hints", "Flashcard_L2W_from_L1W"];

describe("PRODUCTION_EXERCISE_TYPES", () => {
  it("are exactly the level-4 exercise types", () => {
    const all = [...ALL_EXERCISES, RECALL_MEANING, RECALL_WORD, FLASHCARD_MEANING, FLASHCARD_WORD];
    const level4 = [...new Set(all.filter((e) => e.level === 4).map((e) => e.exerciseType))];
    expect([...PRODUCTION_EXERCISE_TYPES].sort()).toEqual(level4.sort());
  });

  it("match the api's list", () => {
    expect([...PRODUCTION_EXERCISE_TYPES].sort()).toEqual([...API_PRODUCTION].sort());
  });
});

describe("canLearnWithThisExercise", () => {
  const needsProduction = { learning_needs_production: true };

  it("lets any exercise learn a word that does not need production", () => {
    expect(canLearnWithThisExercise({ learning_needs_production: false }, EXERCISE_TYPES.flashcardMeaning)).toBe(true);
    expect(canLearnWithThisExercise({}, EXERCISE_TYPES.multipleChoice)).toBe(true);
  });

  it("lets only a production exercise learn a word that needs it", () => {
    expect(canLearnWithThisExercise(needsProduction, EXERCISE_TYPES.flashcardWord)).toBe(true);
    expect(canLearnWithThisExercise(needsProduction, EXERCISE_TYPES.findWordInContextCloze)).toBe(true);
    expect(canLearnWithThisExercise(needsProduction, EXERCISE_TYPES.flashcardMeaning)).toBe(false);
    expect(canLearnWithThisExercise(needsProduction, EXERCISE_TYPES.translateL2toL1)).toBe(false);
  });
});
