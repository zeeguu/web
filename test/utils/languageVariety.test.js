import { describe, it, expect } from "vitest";
import { varietyFieldValue } from "../../src/utils/misc/languageVariety";

// A variety is an answer about one language: Belgian is an answer about Dutch.
// The field has to re-read it per language, or it would offer -- and save --
// Portuguese a variety of Dutch.
describe("varietyFieldValue", () => {
  // `_feed_variety`, not `_variety`: the API stores two variety preferences per
  // language now, and this field reads the one about where the news comes from.
  const userDetails = {
    learned_language: "nl",
    nl_feed_variety: "BE",
    pt_feed_variety: null,
  };

  it("reads the variety of the language asked about", () => {
    expect(varietyFieldValue(userDetails, "nl")).toBe("BE");
  });

  it("is empty for a language stored without a preference", () => {
    expect(varietyFieldValue(userDetails, "pt")).toBe("");
  });

  it("is empty for a language that has no varieties at all", () => {
    expect(varietyFieldValue(userDetails, "da")).toBe("");
  });

  it("is empty rather than undefined before user details arrive", () => {
    expect(varietyFieldValue(undefined, "nl")).toBe("");
  });
});
