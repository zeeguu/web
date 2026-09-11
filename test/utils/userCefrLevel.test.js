import { describe, it, expect } from "vitest";
import { cefrLevelFieldValue } from "../../src/utils/misc/userCefrLevel";

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
