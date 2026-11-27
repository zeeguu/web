import { describe, it, expect, vi } from "vitest";
import { findBookmarkWord, pronounceBookmark } from "../../../src/exercises/utils/pronounceBookmark.js";

function textWith(words) {
  // One paragraph whose linked words are chained head -> next.
  const nodes = words.map((w) => ({ ...w }));
  nodes.forEach((n, i) => (n.next = nodes[i + 1] || null));
  return { paragraphsAsLinkedWordLists: [{ linkedWords: { head: nodes[0] } }], pronounce: vi.fn() };
}

describe("pronounceBookmark", () => {
  it("speaks the linked word, so a multi-word expression is said whole", () => {
    const text = textWith([{ word: "Han", bookmark_id: null }, { word: "vil", bookmark_id: 7 }]);
    const speech = { speakOut: vi.fn() };
    pronounceBookmark(text, speech, { id: 7, from: "vil fortælle" });
    expect(text.pronounce).toHaveBeenCalledWith(findBookmarkWord(text, 7));
    expect(speech.speakOut).not.toHaveBeenCalled();
  });

  it("falls back to the bookmark's text when the word is not in the context", () => {
    const text = textWith([{ word: "Han", bookmark_id: null }]);
    const speech = { speakOut: vi.fn() };
    pronounceBookmark(text, speech, { id: 7, from: "vil fortælle" });
    expect(speech.speakOut).toHaveBeenCalledWith("vil fortælle");
  });
});
