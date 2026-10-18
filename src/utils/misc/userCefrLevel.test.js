import { describe, expect, it } from "vitest";
import { cefrOrdinal } from "./cefrScale";
import { cefrLevelFieldValue, numericToCefr, shouldShowLanguageChoice } from "./userCefrLevel";
import { levelValueFromCefr } from "../../assorted/cefrLevels";

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

describe("A0", () => {
  it("reads texts at A1, the easiest there are", () => {
    expect(numericToCefr(0)).toBe("A1");
  });

  it("is shown as chosen, not as unset", () => {
    expect(cefrLevelFieldValue({ bg_cefr_level: 0 }, "bg")).toBe("0");
    expect(cefrLevelFieldValue({}, "bg")).toBe("");
  });

  it("comes from an A0 link", () => {
    expect(levelValueFromCefr("A0")).toBe("0");
    expect(levelValueFromCefr("A2")).toBe("2");
  });
});
