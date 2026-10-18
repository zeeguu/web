import { describe, expect, it } from "vitest";
import { cefrOrdinal } from "./cefrScale";
import { shouldShowLanguageChoice } from "./userCefrLevel";

describe("cefrOrdinal", () => {
  it("reads a plain level", () => {
    expect(cefrOrdinal("B1")).toBe(3);
  });

  it("reads a compound level as the harder of the two", () => {
    expect(cefrOrdinal("B1/B2")).toBe(4);
  });

  it("is undefined for anything else", () => {
    expect(cefrOrdinal(undefined)).toBeUndefined();
    expect(cefrOrdinal("")).toBeUndefined();
    expect(cefrOrdinal("easy")).toBeUndefined();
  });
});

describe("shouldShowLanguageChoice", () => {
  const b1Danish = { learned_language: "da", da_cefr_level: 3 };

  it("skips the modal for a same-language article at or below the user's level", () => {
    expect(shouldShowLanguageChoice("da", "A2", b1Danish)).toBe(false);
    expect(shouldShowLanguageChoice("da", "B1", b1Danish)).toBe(false);
  });

  it("shows it for a harder article, including a compound level that reaches above", () => {
    expect(shouldShowLanguageChoice("da", "B2", b1Danish)).toBe(true);
    expect(shouldShowLanguageChoice("da", "B1/B2", b1Danish)).toBe(true);
  });

  it("shows it when the article level is unknown", () => {
    expect(shouldShowLanguageChoice("da", undefined, b1Danish)).toBe(true);
  });

  it("always shows it for another language", () => {
    expect(shouldShowLanguageChoice("de", "A1", b1Danish)).toBe(true);
  });
});
