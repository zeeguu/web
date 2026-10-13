import { describe, it, expect } from "vitest";
import { groupByLevel, groupByMonth, calculateMedianRank } from "../../src/words/wordLists/wordListLogic";

describe("groupByLevel", () => {
  it("puts words in their level, most frequent first", () => {
    const byLevel = groupByLevel([
      { id: 1, level: 1, origin_rank: 900 },
      { id: 2, level: 3, origin_rank: 10 },
      { id: 3, level: 1, origin_rank: 50 },
    ]);
    expect(byLevel[1].map((w) => w.id)).toEqual([3, 1]);
    expect(byLevel[3].map((w) => w.id)).toEqual([2]);
    expect(byLevel[4]).toEqual([]);
  });
});

describe("groupByMonth", () => {
  it("groups learned words by month, newest first, skipping undated ones", () => {
    const months = groupByMonth([
      { id: 1, learned_datetime: "2026-09-03T10:00:00Z" },
      { id: 2, learned_datetime: "2026-10-12T10:00:00Z" },
      { id: 3, learned_datetime: "2026-10-01T10:00:00Z" },
      { id: 4 },
    ]);
    expect(months.map((m) => m.monthKey)).toEqual(["2026-10", "2026-09"]);
    expect(months[0].words.map((w) => w.id)).toEqual([2, 3]);
  });
});

describe("calculateMedianRank", () => {
  it("ignores unranked words", () => {
    expect(calculateMedianRank([{ origin_rank: "10" }, { origin_rank: "" }, { origin_rank: "30" }])).toBe(20);
    expect(calculateMedianRank([{ origin_rank: "" }])).toBe(null);
  });
});
