import { describe, it, expect } from "vitest";
import { correctnessBasedOnTries, isCleanAnswer } from "../../src/exercises/CorrectnessBasedOnTries";

describe("correctnessBasedOnTries with alternatives", () => {
  it("counts an accepted alternative as correct, with or without help first", () => {
    for (const message of ["A", "HA", "TA", "TTA"]) {
      expect(correctnessBasedOnTries(message)).toEqual([true, false]);
    }
  });

  it("does not count an alternative as a clean answer", () => {
    expect(isCleanAnswer("A")).toBe(false);
  });

  it("still counts a wrong answer before it as wrong", () => {
    expect(correctnessBasedOnTries("WA")[1]).toBe(true);
  });
});
