import { describe, it, expect } from "vitest";
import { findClozeWordIds } from "../../../src/exercises/utils/findClozeWordIds";

// Minimal InteractiveText: one paragraph of linked words. Each entry is
// [text, sent_i, token_i]; a fused multi-word bookmark is a single entry.
function interactiveText(words) {
  const nodes = words.map(([word, sent_i, token_i], i) => ({ id: `w${i}`, word, token: { sent_i, token_i } }));
  nodes.forEach((n, i) => (n.next = nodes[i + 1] || null));
  return { paragraphsAsLinkedWordLists: [{ linkedWords: { head: nodes[0] } }] };
}

// Bookmark 764925: the context starts mid-sentence at token 3 of sentence 1
// ("...håndkikkert kan du se, at kun en del af ..."), and the bookmark's
// position (0, 7) is relative to that.
const bookmark = {
  from: "en del",
  t_sentence_i: 0,
  t_token_i: 7,
  t_total_token: 2,
  context_sent: 1,
  context_token: 3,
};

const before = [["håndkikkert", 1, 3], ["kan", 1, 4], ["du", 1, 5], ["se,", 1, 6], ["at", 1, 8], ["kun", 1, 9]];
const after = [["af", 1, 12], ["planetens", 1, 13]];

describe("findClozeWordIds", () => {
  it("finds a fused multi-word bookmark in a context that starts mid-sentence", () => {
    const text = interactiveText([...before, ["en del", 1, 10], ...after]);
    expect(findClozeWordIds(text, bookmark)).toEqual(["w6"]);
  });

  it("finds unfused words in a context that starts mid-sentence", () => {
    const text = interactiveText([...before, ["en", 1, 10], ["del", 1, 11], ...after]);
    expect(findClozeWordIds(text, bookmark)).toEqual(["w6", "w7"]);
  });

  it("falls back to the phrase when the position is stale, also for a fused word", () => {
    const text = interactiveText([...before, ["en del", 1, 10], ...after]);
    expect(findClozeWordIds(text, { ...bookmark, t_token_i: 2 })).toEqual(["w6"]);
  });
});
