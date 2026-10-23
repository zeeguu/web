import { describe, it, expect, vi } from "vitest";
import InteractiveText from "../../src/reader/InteractiveText";

/**
 * The tokens a caller hands over may be shared: the feed caches its response
 * and builds every summary preview from it. Restoration, fusion and ungrouping
 * write onto tokens, so building on the caller's own would carry one build's
 * changes into the next -- words vanished, MWEs came back half-grouped.
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

const words = (text) => text.getParagraphs()[0].getWords();

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
  it("leaves the caller's tokens as they were after restoring a bookmark", () => {
    const cached = [[sentence()]];
    const before = JSON.stringify(cached);

    const text = build(cached, [bookmark]);

    expect(words(text).map((w) => w.word)).toContain("i rummet");
    expect(JSON.stringify(cached)).toBe(before);
  });

  it("does not carry an ungrouped MWE into the next build half-grouped", () => {
    const cached = [[sentence()]];
    const first = build(cached);
    const finsk = words(first)[2];
    finsk.splitAndClearMWE();

    const rebuilt = words(build(cached));
    expect(rebuilt.slice(1, 4).map((w) => w.token.mwe_group_id)).toEqual(["g1", "g1", "g1"]);
  });
});
