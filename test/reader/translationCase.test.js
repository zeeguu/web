import { describe, it, expect } from "vitest";
import { matchTranslationCase } from "../../src/reader/translationCase";

describe("matchTranslationCase", () => {
  it("lowercases a translation stored from a sentence-initial origin", () => {
    expect(matchTranslationCase("dette", "Dette", "This")).toBe("this");
  });

  it("capitalises a translation shown over a sentence-initial word", () => {
    expect(matchTranslationCase("Dette", "dette", "this")).toBe("This");
  });

  it("keeps capitals the translation has on its own", () => {
    expect(matchTranslationCase("mandag", "mandag", "Monday")).toBe("Monday");
    expect(matchTranslationCase("Haus", "Haus", "house")).toBe("house");
  });

  it("keeps acronyms and the pronoun I", () => {
    expect(matchTranslationCase("eu", "EU", "EU")).toBe("EU");
    expect(matchTranslationCase("jeg", "Jeg", "I")).toBe("I");
    expect(matchTranslationCase("jeg er", "Jeg er", "I am")).toBe("I am");
  });

  it("passes the translation through without a stored origin", () => {
    expect(matchTranslationCase("dette", undefined, "This")).toBe("This");
    expect(matchTranslationCase("dette", "Dette", null)).toBe(null);
  });
});
