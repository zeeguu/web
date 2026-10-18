import { describe, it, expect } from "vitest";
import {
  cefrLevelFieldValue,
  numericToCefr,
  shouldShowLanguageChoice,
} from "../../src/utils/misc/userCefrLevel";
import { levelValueFromCefr } from "../../src/assorted/cefrLevels";

// Levels are stored per language on userDetails, as numbers, under
// `<code>_cefr_level`. The CEFR field holds a CEFR_LEVELS value, which is that
// number as a string -- so the conversion and the per-language lookup both have
// to be right, or Language Settings saves one language's level under another.
describe("cefrLevelFieldValue", () => {
  const userDetails = {
    learned_language: "nl",
    nl_cefr_level: 4,
    pt_cefr_level: 1,
  };

  it("reads the level of the language asked about, not the learned one", () => {
    expect(cefrLevelFieldValue(userDetails, "pt")).toBe("1");
  });

  it("returns the level as a string, so it matches a CEFR_LEVELS value", () => {
    expect(cefrLevelFieldValue(userDetails, "nl")).toBe("4");
  });

  it("is empty for a language the user has no level for", () => {
    expect(cefrLevelFieldValue(userDetails, "es")).toBe("");
  });

  it("is empty rather than 'undefined' when there are no user details yet", () => {
    expect(cefrLevelFieldValue(undefined, "nl")).toBe("");
  });
});

// A0 (stored 0) is for learners who know nothing yet. It is a level, not an
// unset one; and for picking texts it reads as A1, the easiest there are.
describe("A0", () => {
  const a0Bulgarian = { learned_language: "bg", bg_cefr_level: 0 };

  it("is shown as chosen, not as unset", () => {
    expect(cefrLevelFieldValue(a0Bulgarian, "bg")).toBe("0");
  });

  it("reads texts at A1", () => {
    expect(numericToCefr(0)).toBe("A1");
  });

  it("is not offered a simplification of an A1 article, which is already at A1", () => {
    expect(shouldShowLanguageChoice("bg", "A1", a0Bulgarian)).toBe(false);
    expect(shouldShowLanguageChoice("bg", "A2", a0Bulgarian)).toBe(true);
  });

  it("comes from an A0 link", () => {
    expect(levelValueFromCefr("A0")).toBe("0");
    expect(levelValueFromCefr("A2")).toBe("2");
  });
});
