import { describe, it, expect } from "vitest";
import { isTooLongToTranslate, looksLikeWords, MAX_WORDS_TO_TRANSLATE } from "../../src/translate/longText";

describe("isTooLongToTranslate", () => {
  it("looks up words and short phrases", () => {
    expect(isTooLongToTranslate("hygge")).toBe(false);
    expect(isTooLongToTranslate("  at holde øje med  ")).toBe(false);
    expect(isTooLongToTranslate("en to tre fire fem seks")).toBe(false);
  });

  it("reads sentences and messages", () => {
    expect(isTooLongToTranslate("Hej, kommer du i aften til middag?")).toBe(true);
    expect(isTooLongToTranslate("Hej!\nKommer du?")).toBe(true);
  });

  it("has nothing to say about nothing", () => {
    expect(isTooLongToTranslate("")).toBe(false);
    expect(isTooLongToTranslate(null)).toBe(false);
  });

  it("draws the line after MAX_WORDS_TO_TRANSLATE words", () => {
    const words = (n) => Array.from({ length: n }, () => "ord").join(" ");
    expect(isTooLongToTranslate(words(MAX_WORDS_TO_TRANSLATE))).toBe(false);
    expect(isTooLongToTranslate(words(MAX_WORDS_TO_TRANSLATE + 1))).toBe(true);
  });
});

describe("looksLikeWords", () => {
  it("takes words and phrases, in any script", () => {
    expect(looksLikeWords("hygge")).toBe(true);
    expect(looksLikeWords("at holde øje med")).toBe(true);
    expect(looksLikeWords("здравей")).toBe(true);
    expect(looksLikeWords("aujourd'hui")).toBe(true);
    expect(looksLikeWords("e-mail")).toBe(true);
    expect(looksLikeWords("Tak!")).toBe(true);
  });

  it("leaves whatever else was on the clipboard", () => {
    expect(looksLikeWords("~/repos/teaching/tid-lecture-notes main* 18:05:19")).toBe(false);
    expect(looksLikeWords("https://zeeguu.org")).toBe(false);
    expect(looksLikeWords("4821")).toBe(false);
    expect(looksLikeWords("npm run ios:mir")).toBe(false);
  });

  it("leaves long texts to Translate interactively", () => {
    expect(looksLikeWords("Hej, kommer du i aften til middag?")).toBe(false);
  });
});
