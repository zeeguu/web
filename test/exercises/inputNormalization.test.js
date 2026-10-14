import { describe, it, expect } from "vitest";
import { acceptedAnswers, normalizeAnswer } from "../../src/exercises/inputNormalization";

describe("acceptedAnswers", () => {
  it("accepts each listed form of a word, and the whole list", () => {
    const answers = acceptedAnswers("твій/твоя/твоє/твої");
    expect(answers).toContain(normalizeAnswer("твоя"));
    expect(answers).toContain(normalizeAnswer("твої"));
    expect(answers).toContain(normalizeAnswer("твій/твоя/твоє/твої"));
  });

  it("splits spaced slashes", () => {
    expect(acceptedAnswers("αυτοί / αυτές / αυτά")).toContain(normalizeAnswer("αυτές"));
  });

  it("is one answer without a slash", () => {
    expect(acceptedAnswers("dog")).toEqual([normalizeAnswer("dog")]);
  });

  it("doesn't split a slash between digits", () => {
    expect(acceptedAnswers("24/7")).toEqual([normalizeAnswer("24/7")]);
  });
});
