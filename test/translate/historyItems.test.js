import { describe, it, expect } from "vitest";
import { historyItems } from "../../src/translate/historyItems";

describe("historyItems", () => {
  const searches = [
    { id: 1, search_word: "hygge", search_time: "2026-11-20T10:00:00" },
    { id: 2, search_word: "tak", search_time: "2026-11-24T09:00:00" },
  ];
  const texts = [
    { id: 7, preview: "Hej, kommer du i aften?", language: "da", last_opened_at: "2026-11-22T10:00:00" },
    { id: 9, preview: "Hello there", language: "en", last_opened_at: "2026-11-24T12:00:00" },
  ];

  it("puts searched words and texts in one list, newest first", () => {
    expect(historyItems(searches, texts, "da").map((item) => item.key)).toEqual(["t9", "s2", "t7", "s1"]);
  });

  it("keeps texts in other languages, and names their language", () => {
    const items = historyItems([], texts, "da");
    expect(items.map((item) => [item.text.id, item.otherLanguage])).toEqual([
      [9, "en"],
      [7, null],
    ]);
  });

  it("copes with a list that has not loaded", () => {
    expect(historyItems(null, null, "da")).toEqual([]);
  });
});
