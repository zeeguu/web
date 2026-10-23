import { describe, it, expect, vi } from "vitest";
import InteractiveText from "../../src/reader/InteractiveText";

/**
 * The tokens a caller hands over may be shared: the feed caches its response
 * and builds every summary preview from it. Restoration and fusion write onto
 * tokens, so building on the caller's own carried one build's fusions and
 * bookmarks into the next -- words vanished, deleted translations came back.
 */

const tok = (text, token_i, extra = {}) => ({ text, token_i, sent_i: 0, paragraph_i: 0, ...extra });

const sentence = () => {
  const g = { mwe_group_id: "g1" };
  return [tok("fra", 0), tok("en", 1, g), tok("finsk", 2, g), tok("satellit", 3, g), tok("i", 4), tok("rummet", 5), tok(".", 6)];
};

const build = (paragraphs, previousBookmarks = []) =>
  new InteractiveText({
    tokenizedParagraphs: paragraphs,
    previousBookmarks,
    api: { TRANSLATE_TEXT: "TRANSLATE TEXT", deleteBookmark: vi.fn() },
    language: "da",
    zeeguuSpeech: { language: "da" },
  });

const words = (it) => it.getParagraphs()[0].getWords().map((w) => w.word);

const bookmark = {
  id: 7,
  origin: "i rummet",
  translation: "in space",
  context_sent: 0,
  t_sentence_i: 0,
  context_token: 0,
  t_token_i: 4,
  t_total_token: 2,
  is_mwe: false,
};

describe("InteractiveText builds on its own copy of the tokens", () => {
  it("a collapsed MWE does not reach the next build", () => {
    const cached = [[sentence()]];
    const first = build(cached);
    first.getParagraphs()[0].getWords()[1].fuseMWEPartners(first.api);
    expect(words(first)).toContain("en finsk satellit");

    expect(words(build(cached))).toEqual(["fra", "en", "finsk", "satellit", "i", "rummet", "."]);
  });

  it("a restored bookmark does not reach the next build", () => {
    const cached = [[sentence()]];
    expect(words(build(cached, [bookmark]))).toContain("i rummet");

    // Rebuilt without the bookmark (deleted since): the words come back plain.
    expect(words(build(cached))).toEqual(["fra", "en", "finsk", "satellit", "i", "rummet", "."]);
    expect(cached[0][0][4].bookmark).toBeUndefined();
  });
});
