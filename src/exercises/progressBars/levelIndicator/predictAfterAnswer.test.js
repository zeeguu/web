import { describe, expect, it } from "vitest";
import { predictAfterAnswer, isWordLearned } from "./predictAfterAnswer";

// Mirrors the api scheduler (four_levels_per_word.py): three correct answers
// per level; with fast progression a clean answer ("C") moves up a level now.

describe("predictAfterAnswer", () => {
  it("moves a correct answer one step within the level", () => {
    expect(predictAfterAnswer({ level: 1, cooling_interval: 0, message: "C" })).toEqual({
      level: 1,
      cooling_interval: 1,
    });
  });

  it("moves up a level after the third step", () => {
    expect(predictAfterAnswer({ level: 1, cooling_interval: 2, message: "HC" })).toEqual({
      level: 2,
      cooling_interval: 0,
    });
  });

  it("moves a wrong answer one step back", () => {
    expect(predictAfterAnswer({ level: 2, cooling_interval: 1, message: "W" })).toEqual({
      level: 2,
      cooling_interval: 0,
    });
  });

  it("with fast progression, moves a clean answer up a level at once", () => {
    expect(
      predictAfterAnswer({ level: 1, cooling_interval: 0, message: "C", fastProgression: true }),
    ).toEqual({ level: 2, cooling_interval: 0 });
  });

  it("with fast progression, an answer with a hint is still one step", () => {
    expect(
      predictAfterAnswer({ level: 1, cooling_interval: 0, message: "HC", fastProgression: true }),
    ).toEqual({ level: 1, cooling_interval: 1 });
  });

  it("changes nothing before the learner has answered", () => {
    expect(predictAfterAnswer({ level: 3, cooling_interval: 1, message: "" })).toEqual({
      level: 3,
      cooling_interval: 1,
    });
  });
});

describe("isWordLearned", () => {
  it("is learned at the longest interval with a correct answer", () => {
    expect(isWordLearned({ message: "HC", is_about_to_be_learned: true, is_last_in_cycle: true })).toBe(true);
  });

  it("is learned with a clean answer when fast progression says it is about to be", () => {
    // the api says is_about_to_be_learned for every level-4 word of a fast user
    expect(isWordLearned({ message: "C", is_about_to_be_learned: true, is_last_in_cycle: false })).toBe(true);
  });

  it("is not learned with a hint before the longest interval, even if about to be", () => {
    expect(isWordLearned({ message: "HC", is_about_to_be_learned: true, is_last_in_cycle: false })).toBe(false);
  });

  it("is not learned when the word is not about to be learned", () => {
    expect(isWordLearned({ message: "C", is_about_to_be_learned: false, is_last_in_cycle: false })).toBe(false);
  });

  it("is not learned with a wrong answer", () => {
    expect(isWordLearned({ message: "W", is_about_to_be_learned: true, is_last_in_cycle: true })).toBe(false);
  });
});
