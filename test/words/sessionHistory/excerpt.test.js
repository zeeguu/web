import { describe, it, expect } from "vitest";
import { highlightWord, excerptParts } from "../../../src/words/sessionHistory/excerpt";

describe("highlightWord", () => {
  it("splits around the first occurrence, ignoring case", () => {
    expect(highlightWord("Le Caritatif et le caritatif", "caritatif")).toEqual([
      { text: "Le ", isWord: false },
      { text: "Caritatif", isWord: true },
      { text: " et le caritatif", isWord: false },
    ]);
  });

  it("returns the context whole when the word isn't in it", () => {
    expect(highlightWord("une phrase", "mot")).toEqual([{ text: "une phrase", isWord: false }]);
  });
});

describe("excerptParts", () => {
  it("marks where the stored excerpt was cut", () => {
    const parts = excerptParts({
      origin: "caritatif",
      context: "l'organisme caritatif Phoenix",
      context_cut_left: true,
      context_cut_right: true,
    });
    expect(parts.map((p) => p.text).join("")).toBe("… l'organisme caritatif Phoenix …");
    expect(parts.find((p) => p.isWord).text).toBe("caritatif");
  });
});
