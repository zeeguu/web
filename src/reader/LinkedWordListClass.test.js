import { describe, it, expect, vi } from "vitest";
import { List } from "linked-list";
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

/**
 * Breaking a fusion at the join the learner made (#1258).
 *
 * The seams are the joins between tokens that do not share a detector group.
 * These run on a real linked list, because breaking relinks the pieces in
 * place and the list is what the reader renders.
 */
describe("seams mark the joins the learner made", () => {
  const g = (id) => ({ mwe_group_id: id });

  /** A word whose mergedTokens carry the given group ids. */
  const fusion = (texts, groups) => {
    const w = word(texts[0], 1, g(groups[0]));
    w.word = texts.join(" ");
    w.total_tokens = texts.length;
    w.mergedTokens = texts.map((t, i) => tok(t, 1 + i, groups[i] ? g(groups[i]) : {}));
    return w;
  };

  it("finds the join between two detector groups, and only that one", () => {
    const w = fusion(["har", "fundet", "et", "stykke"], ["g1", "g1", "g2", "g2"]);
    expect(w.seams()).toEqual([2]);
  });

  it("finds no seam inside a detector group", () => {
    const w = fusion(["har", "fundet"], ["g1", "g1"]);
    expect(w.seams()).toEqual([]);
  });

  it("treats a join between two plain words as the learner's", () => {
    // Nothing else could have joined them, and without this a hand fusion of
    // plain words could never be undone once the chain icon is gone.
    const w = fusion(["et", "stykke"], [undefined, undefined]);
    expect(w.seams()).toEqual([1]);
  });

  it("finds the join where a plain word widened a group", () => {
    const w = fusion(["at", "finde", "ud", "af"], [undefined, "g1", "g1", "g1"]);
    expect(w.seams()).toEqual([1]);
  });

  it("hands the renderer the text between seams", () => {
    const w = fusion(["har", "fundet", "et", "stykke"], ["g1", "g1", "g2", "g2"]);
    expect(w.pieces()).toEqual([
      { text: "har fundet", seam: null },
      { text: "et stykke", seam: 2 },
    ]);
  });

  it("breaks back into both detector groups, as expressions", () => {
    const w = fusion(["har", "fundet", "et", "stykke"], ["g1", "g1", "g2", "g2"]);
    const before = word("Forskere", 0);
    const after = word("om", 5);
    const list = List.from([before, w, after]);

    const [left, right] = w.breakAtSeam(2);

    expect(list.toArray().map((x) => x.word)).toEqual(["Forskere", "har fundet", "et stykke", "om"]);
    expect(left.mweExpression).toBe("har fundet");
    expect(right.mweExpression).toBe("et stykke");
    expect(left.isMWE()).toBe(true);
    expect(right.getMWEGroupId()).toBe("g2");
    expect(left.translation).toBeNull();
    expect(right.total_tokens).toBe(2);
  });

  it("breaks the middle join and leaves the others alone", () => {
    const w = fusion(["a", "b", "c"], [undefined, undefined, undefined]);
    List.from([w]);

    const [left, right] = w.breakAtSeam(1);

    expect(left.word).toBe("a");
    expect(right.word).toBe("b c");
    expect(right.seams()).toEqual([1]);
  });

  it("keeps a still-fused piece from claiming to be the detector's expression", () => {
    // "har fundet et | stykke" is no longer the detector's "har fundet".
    const w = fusion(["har", "fundet", "et", "stykke"], ["g1", "g1", undefined, undefined]);
    List.from([w]);

    const [left, right] = w.breakAtSeam(3);

    expect(left.word).toBe("har fundet et");
    expect(left.mweExpression).toBeUndefined();
    expect(left.isMWE()).toBe(false);
    // ...but its tokens still know, so its own seam survives.
    expect(left.seams()).toEqual([2]);
    expect(right.word).toBe("stykke");
  });

  it("does not carry the old bookmark into the pieces", () => {
    const w = fusion(["et", "stykke"], [undefined, undefined]);
    w.mergedTokens[0].bookmark = { id: 7, translation: "a piece" };
    List.from([w]);

    const [left] = w.breakAtSeam(1);

    expect(left.bookmark_id).toBeUndefined();
    expect(left.translation).toBeNull();
  });
});
