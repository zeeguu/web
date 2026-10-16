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

describe("the English infinitive 'to'", () => {
  const typed = (answer) => normalizeAnswer(answer, "en");

  it("is optional on either side", () => {
    expect(acceptedAnswers("to look up", "en")).toContain(typed("look up"));
    expect(acceptedAnswers("look up", "en")).toContain(typed("To look up"));
  });

  it("only counts at the start", () => {
    expect(acceptedAnswers("listen to", "en")).not.toContain(typed("listen"));
  });

  it("is a word of its own when nothing follows", () => {
    expect(acceptedAnswers("to", "en")).toEqual(["TO"]);
  });

  it("is only English", () => {
    expect(acceptedAnswers("to", "da")).toEqual(["TO"]);
    expect(normalizeAnswer("to ting", "da")).toBe("TO TING");
  });
});
