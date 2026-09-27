import { describe, it, expect, vi } from "vitest";
import { Word } from "./LinkedWordListClass";

/**
 * What a fusion must preserve.
 *
 * Splitting rebuilds the text from `mergedTokens` -- one Word per entry -- so a
 * token missing from that list is a word missing from the page. That is not a
 * cosmetic failure: the learner loses part of the sentence they were reading.
 *
 * The case that caught it: "Forskere har fundet et stykke ...". The detector
 * grouped "har fundet" and "et stykke" separately, the learner fused them, and
 * "stykke" vanished when they unlinked, because fuseWithPrevious kept only the
 * head token of the word being fused.
 */

const tok = (text, token_i, extra = {}) => ({
  text,
  token_i,
  sent_i: 0,
  paragraph_i: 0,
  ...extra,
});

/** A Word standing alone, as the tokenizer produces it. */
const word = (text, token_i, extra = {}) => new Word(tok(text, token_i, extra));

/** Two Words already fused into one, as fuseMWEPartners leaves an MWE. */
const fusedWord = (texts, startIndex, extra = {}) => {
  const w = word(texts[0], startIndex, extra);
  w.word = texts.join(" ");
  w.total_tokens = texts.length;
  w.mergedTokens = texts.map((t, i) => tok(t, startIndex + i));
  return w;
};

const link = (...words) => {
  words.forEach((w, i) => {
    w.prev = words[i - 1] ?? null;
    w.next = words[i + 1] ?? null;
  });
  // detach() is a linked-list concern we do not exercise here.
  words.forEach((w) => (w.detach = vi.fn()));
  return words;
};

const api = () => ({ deleteBookmark: vi.fn() });

describe("fusion preserves every token", () => {
  it("keeps both tokens of a multi-token word when fusing with the previous", () => {
    // "har fundet" + "et stykke" -> all four tokens survive
    const [harFundet, etStykke] = link(fusedWord(["har", "fundet"], 1), fusedWord(["et", "stykke"], 3));
    harFundet.translation = "has found";

    const fused = etStykke.fuseWithPrevious(api());

    expect(fused.mergedTokens.map((t) => t.text)).toEqual(["har", "fundet", "et", "stykke"]);
    expect(fused.word).toBe("har fundet et stykke");
  });

  it("keeps both tokens of a multi-token word when fusing with the next", () => {
    const [harFundet, etStykke] = link(fusedWord(["har", "fundet"], 1), fusedWord(["et", "stykke"], 3));
    etStykke.translation = "a piece";

    const fused = harFundet.fuseWithNext(api());

    expect(fused.mergedTokens.map((t) => t.text)).toEqual(["har", "fundet", "et", "stykke"]);
  });

  it("keeps single tokens too, in reading order", () => {
    const [a, b] = link(word("et", 3), word("stykke", 4));
    a.translation = "a";

    const fused = b.fuseWithPrevious(api());

    expect(fused.mergedTokens.map((t) => t.text)).toEqual(["et", "stykke"]);
  });

  it("deletes the bookmark of the word it swallows", () => {
    const [a, b] = link(word("et", 3), word("stykke", 4));
    a.translation = "a";
    a.bookmark_id = 4242;
    const client = api();

    b.fuseWithPrevious(client);

    expect(client.deleteBookmark).toHaveBeenCalledWith(4242);
  });
});

describe("a fused word stops claiming to be the detector's expression", () => {
  it("drops mweExpression, so the translation is not requested for the old span", () => {
    // translate() sends `word.mweExpression || word.word`; a stale
    // mweExpression means the learner sees "at finde ud af" and receives a
    // translation of "finde ud af".
    const [at, findeUdAf] = link(word("at", 0), fusedWord(["finde", "ud", "af"], 1, { mwe_group_id: "mwe_0_0_0" }));
    findeUdAf.mweExpression = "finde ud af";
    at.translation = "to";

    const fused = findeUdAf.fuseWithPrevious(api());

    expect(fused.mweExpression).toBeUndefined();
    expect(fused.token.mwe_group_id).toBeUndefined();
    expect(fused.word).toBe("at finde ud af");
  });
});

describe("a separated MWE is never widened", () => {
  it("refuses to fuse, because the backend cannot persist a discontinuous span", () => {
    const [plain, separated] = link(
      word("dich", 1),
      word("an", 4, { mwe_group_id: "mwe_0_0_0", mwe_is_separated: true }),
    );
    plain.translation = "you";

    const result = separated.fuseWithNeighborsIfNeeded(api());

    expect(result).toBe(separated);
    expect(result.word).toBe("an");
  });
});
