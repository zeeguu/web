import { describe, it, expect } from "vitest";
import { calculateStats, formatDurationShort, groupByDate } from "../../../src/words/sessionHistory/sessionStats";

const MIN = 60 * 1000;

describe("calculateStats", () => {
  it("adds up time, words and sessions per kind of activity", () => {
    const stats = calculateStats([
      { session_type: "reading", duration: 5 * MIN, word_count: 3 },
      { session_type: "reading", duration: 2 * MIN, word_count: 1 },
      { session_type: "exercise", duration: 4 * MIN, word_count: 6, correct_count: 4 },
      { session_type: "browsing", duration: MIN, word_count: 0 },
    ]);

    expect(stats.reading).toEqual({ time: 7 * MIN, words: 4, sessions: 2 });
    expect(stats.exercise).toEqual({ time: 4 * MIN, words: 6, correct: 4, sessions: 1 });
    expect(stats.browsing).toEqual({ time: MIN, words: 0, sessions: 1 });
    expect(stats.audio.sessions).toBe(0);
  });
});

describe("formatDurationShort", () => {
  it("reads minutes, then hours and minutes", () => {
    expect(formatDurationShort(0)).toBe("0 min");
    expect(formatDurationShort(14 * MIN)).toBe("14 min");
    expect(formatDurationShort(75 * MIN)).toBe("1h 15 min");
    expect(formatDurationShort(120 * MIN)).toBe("2h");
  });
});

describe("groupByDate", () => {
  it("groups sessions by local day, keeping their order", () => {
    const groups = groupByDate([
      { start_time: "2026-10-13T15:00:00Z" },
      { start_time: "2026-10-13T08:00:00Z" },
      { start_time: "2026-10-11T08:00:00Z" },
    ]);
    const days = Object.values(groups);
    expect(days.map((d) => d.length)).toEqual([2, 1]);
  });
});
