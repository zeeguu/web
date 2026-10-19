import { describe, it, expect } from "vitest";
import {
  cefrLevelFieldValue,
  explanationCefr,
  isA0Learner,
  numericToCefr,
  shouldShowLanguageChoice,
} from "../../src/utils/misc/userCefrLevel";
import { levelValueFromCefr } from "../../src/assorted/cefrLevels";
import { cefrOrdinal } from "../../src/utils/misc/cefrScale";

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

describe("explanationCefr", () => {
  it("sends a CEFR level, not the stored number", () => {
    expect(explanationCefr("3")).toBe("B1");
    expect(explanationCefr("0")).toBe("A1");
  });

  it("passes a stored CEFR code through", () => {
    expect(explanationCefr("C1")).toBe("C1");
  });

  it("is A1 when onboarding stored nothing", () => {
    expect(explanationCefr(undefined)).toBe("A1");
    expect(explanationCefr("")).toBe("A1");
  });
});

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

  it("asks when the stored level is not one it knows", () => {
    expect(shouldShowLanguageChoice("da", "A2", { learned_language: "da", da_cefr_level: 7 })).toBe(true);
  });

  it("always shows it for another language", () => {
    expect(shouldShowLanguageChoice("de", "A1", b1Danish)).toBe(true);
  });
});

describe("isA0Learner", () => {
  it("is true at A0, in the language being learned", () => {
    expect(isA0Learner({ learned_language: "bg", bg_cefr_level: 0 })).toBe(true);
    expect(isA0Learner({ learned_language: "da", bg_cefr_level: 0, da_cefr_level: 3 })).toBe(false);
  });

  it("is false with no level, which is not A0", () => {
    expect(isA0Learner({ learned_language: "bg", bg_cefr_level: null })).toBe(false);
    expect(isA0Learner({ learned_language: "bg" })).toBe(false);
    expect(isA0Learner(undefined)).toBe(false);
  });
});
