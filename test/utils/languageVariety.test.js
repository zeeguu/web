import { describe, it, expect } from "vitest";
import { varietyFieldValue, dialectFieldValue, effectiveDialect } from "../../src/utils/misc/languageVariety";

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

// A dialect is a different answer from a variety -- which variety of the
// language you are learning, not which country's news you want -- and it is
// stored under its own key.
describe("dialectFieldValue", () => {
  const userDetails = {
    learned_language: "pt",
    pt_dialect: "BR",
    pt_feed_variety: "PT",
    nl_dialect: null,
  };

  it("reads the dialect of the language asked about", () => {
    expect(dialectFieldValue(userDetails, "pt")).toBe("BR");
  });

  it("does not answer with the feed variety of the same language", () => {
    // The two are stored side by side and mean different things: reading news
    // from Portugal is not a statement about which Portuguese you are learning.
    expect(dialectFieldValue(userDetails, "pt")).not.toBe(userDetails.pt_feed_variety);
  });

  it("is empty for a language stored without a preference", () => {
    expect(dialectFieldValue(userDetails, "nl")).toBe("");
  });

  it("is empty rather than undefined before user details arrive", () => {
    expect(dialectFieldValue(undefined, "pt")).toBe("");
  });
});

describe("effectiveDialect", () => {
  const dialects = [{ country: "PT" }, { country: "BR" }];

  it("shows the stored dialect when there is one", () => {
    expect(effectiveDialect(dialects, "BR")).toBe("BR");
  });

  it("shows the first when nothing is stored", () => {
    // Not "nothing selected": a learner with no preference is already read in
    // European Portuguese, and the control has to say what they hear.
    expect(effectiveDialect(dialects, "")).toBe("PT");
  });

  it("survives a catalogue that has not arrived yet", () => {
    expect(effectiveDialect(undefined, "")).toBe("");
    expect(effectiveDialect([], "")).toBe("");
  });
});
