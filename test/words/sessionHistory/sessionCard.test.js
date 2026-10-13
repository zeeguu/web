import { describe, it, expect } from "vitest";
import {
  durationLabel,
  sessionDetails,
  sessionTitle,
  isSlim,
  showsBrowsingNote,
} from "../../../src/words/sessionHistory/sessionCard";

describe("durationLabel", () => {
  it("reads at a glance", () => {
    expect(durationLabel(45 * 1000)).toBe("45 s");
    expect(durationLabel(6.2 * 60 * 1000)).toBe("6 min");
    expect(durationLabel(65 * 60 * 1000)).toBe("1 h 5 min");
    expect(durationLabel(120 * 60 * 1000)).toBe("2 h");
  });
});

describe("sessionDetails", () => {
  it("says what a teacher asks of a reading session", () => {
    const details = sessionDetails({
      session_type: "reading",
      start_time: "2026-10-08T07:37:00Z",
      article_word_count: 563,
      article_cefr_level: "B1",
      reading_completion: 0.8,
      word_count: 3,
    });
    expect(details.slice(1)).toEqual(["563 words", "B1", "read 80%", "3 words looked up"]);
  });

  it("leaves out what isn't known", () => {
    const details = sessionDetails({ session_type: "reading", start_time: "2026-10-08T07:37:00Z", word_count: 0 });
    expect(details).toHaveLength(1);
  });

  it("gives exercises their count and correctness", () => {
    const details = sessionDetails({
      session_type: "exercise",
      start_time: "2026-10-08T07:37:00Z",
      word_count: 15,
      accuracy: 60,
    });
    expect(details.slice(1)).toEqual(["15 words", "60% correct"]);
  });
});

describe("rows", () => {
  it("titles and slims sessions", () => {
    expect(sessionTitle({ session_type: "browsing" })).toBe("Browsed the article list");
    expect(isSlim({ session_type: "browsing", word_count: 0 })).toBe(true);
    expect(isSlim({ session_type: "browsing", word_count: 2 })).toBe(false);
    expect(isSlim({ session_type: "reading", word_count: 0 })).toBe(false);
  });

  it("explains missing browsing only for periods before it was tracked", () => {
    expect(showsBrowsingNote([{ start_time: "2026-10-08T07:37:00Z" }])).toBe(false);
    expect(showsBrowsingNote([{ start_time: "2025-11-30T07:37:00Z" }])).toBe(true);
  });
});
