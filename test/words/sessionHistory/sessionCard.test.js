import { describe, it, expect } from "vitest";
import {
  durationLabel,
  sessionDetails,
  sessionTitle,
  isSlim,
  isBlip,
  showsBrowsingNote,
  groupExerciseWords,
  leftThePage,
  practisedCount,
  groupBrowsingWords,
  awayStretches,
  scaledPercent,
  outOfFocusMs,
  idleMs,
  idleUnplaced,
  summaryStrip,
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
    expect(isSlim({ session_type: "reading", word_count: 0, duration: 5 * 60000 })).toBe(false);
    expect(isSlim({ session_type: "reading", word_count: 0, duration: 7000 })).toBe(true);
    expect(isSlim({ session_type: "reading", word_count: 1, duration: 7000 })).toBe(false);
  });

  it("explains missing browsing only for periods before it was tracked", () => {
    expect(showsBrowsingNote([{ start_time: "2026-10-08T07:37:00Z" }])).toBe(false);
    expect(showsBrowsingNote([{ start_time: "2025-11-30T07:37:00Z" }])).toBe(true);
  });
});

describe("groupExerciseWords", () => {
  it("shows each word once and separates the ones that needed help", () => {
    const { neededHelp, right } = groupExerciseWords([
      { origin: "chaque", translation: "elk", correct: true },
      { origin: "aucun", translation: "niets", correct: true },
      { origin: "chaque", translation: "elk", correct: false },
    ]);
    expect(neededHelp.map((w) => [w.origin, w.results])).toEqual([["chaque", [true, false]]]);
    expect(right.map((w) => w.origin)).toEqual(["aucun"]);
  });
});

describe("leftThePage", () => {
  it("says how often, only when the session was distracted", () => {
    expect(leftThePage({ focus_level: "distracted", interruptions: 9 })).toBe("left the page 9 times");
    expect(leftThePage({ focus_level: "moderate", interruptions: 3 })).toBe(null);
    expect(leftThePage({ focus_level: "focused", interruptions: 0 })).toBe(null);
  });
});

describe("groupBrowsingWords", () => {
  it("puts the words under the article they were translated in", () => {
    const words = [
      { origin: "sikahjorte", article_id: 7, article_title: "Hjorte i skoven" },
      { origin: "ønske", article_id: 9, article_title: "Jul" },
      { origin: "skov", article_id: 7, article_title: "Hjorte i skoven" },
      { origin: "gammel" },
    ];
    expect(groupBrowsingWords(words).map((g) => [g.title, g.words.map((w) => w.origin)])).toEqual([
      ["Hjorte i skoven", ["sikahjorte", "skov"]],
      ["Jul", ["ønske"]],
      [null, ["gammel"]],
    ]);
  });
});

describe("practisedCount", () => {
  it("counts the looked-up words practised since", () => {
    const words = [{ practised: true }, { practised: false }, { practised: true }];
    expect(practisedCount({ session_type: "reading", words })).toBe(2);
    expect(practisedCount({ session_type: "browsing" })).toBe(0);
  });

  it("is 0 for an exercise session: its words are the practice", () => {
    expect(practisedCount({ session_type: "exercise", words: [{ practised: true }] })).toBe(0);
  });
});

describe("awayStretches", () => {
  it("places the time away along the session", () => {
    const session = {
      start_time: "2026-10-04T17:00:00Z",
      end_time: "2026-10-04T17:40:00Z",
      away: [
        ["2026-10-04T17:10:00Z", "2026-10-04T17:20:00Z"],
        ["2026-10-04T17:39:00Z", "2026-10-04T17:45:00Z", "closed"],
      ],
    };
    expect(awayStretches(session)).toEqual([
      { left: 25, width: 25, kind: "away" },
      { left: 97.5, width: 2.5, kind: "closed" },
    ]);
  });

  it("has nothing to place without a span or away times", () => {
    expect(awayStretches({ start_time: "2026-10-04T17:00:00Z", end_time: "2026-10-04T17:00:00Z", away: [] })).toEqual([]);
    expect(awayStretches({ start_time: "2026-10-04T17:00:00Z", end_time: "2026-10-04T17:40:00Z" })).toEqual([]);
  });
});

describe("scaledPercent", () => {
  it("draws lengths to the summary's scale, full width at most", () => {
    const total = 4 * 60 * 60000;
    expect(scaledPercent(60 * 60000, total)).toBe(25);
    expect(scaledPercent(12 * 60 * 60000, total)).toBe(100);
    expect(scaledPercent(60000, 0)).toBe(100);
  });
});

describe("outOfFocusMs", () => {
  it("adds up the time in another tab or app, not the article closed", () => {
    const session = {
      away: [
        ["2026-10-04T17:10:00Z", "2026-10-04T17:20:00Z"],
        ["2026-10-04T17:30:00Z", "2026-10-04T17:31:00Z"],
        ["2026-10-04T17:40:00Z", "2026-10-04T18:40:00Z", "closed"],
      ],
    };
    expect(outOfFocusMs(session)).toBe(11 * 60000);
    expect(outOfFocusMs({})).toBe(0);
  });
});

describe("isBlip", () => {
  it("is under 30 seconds with no word looked up", () => {
    expect(isBlip({ session_type: "reading", word_count: 0, duration: 7000 })).toBe(true);
    expect(isBlip({ session_type: "browsing", word_count: 0, duration: 29000 })).toBe(true);
    expect(isBlip({ session_type: "browsing", word_count: 0, duration: 33000 })).toBe(false);
    expect(isBlip({ session_type: "reading", word_count: 1, duration: 7000 })).toBe(false);
  });
});

describe("idle time", () => {
  const base = {
    start_time: "2026-10-07T07:07:00Z",
    end_time: "2026-10-07T12:07:00Z", // open 5 h
    duration: 10 * 60000,
    away: [["2026-10-07T08:00:00Z", "2026-10-07T08:20:00Z"]],
  };

  it("is the logged idle stretches when the reader logged them", () => {
    const tracked = {
      ...base,
      idle_tracked: true,
      away: [...base.away, ["2026-10-07T09:00:00Z", "2026-10-07T10:00:00Z", "idle"]],
    };
    expect(idleMs(tracked)).toBe(60 * 60000);
    expect(idleUnplaced(tracked)).toBe(false);
  });

  it("is what nothing accounts for when it was not logged", () => {
    expect(idleMs(base)).toBe((300 - 10 - 20) * 60000);
    expect(idleUnplaced(base)).toBe(true);
  });

  it("keeps the timeline when the unknown idle is a small part of it", () => {
    const mostlyKnown = {
      start_time: "2026-10-04T17:55:00Z",
      end_time: "2026-10-04T18:56:00Z", // open 61 min
      duration: 44 * 60000,
      away: [["2026-10-04T18:00:00Z", "2026-10-04T18:10:00Z"]],
    };
    expect(idleMs(mostlyKnown)).toBe(7 * 60000);
    expect(idleUnplaced(mostlyKnown)).toBe(false);
  });

  it("leaves such a session a strip of what is known, from the start", () => {
    expect(summaryStrip(base)).toEqual({
      length: 30 * 60000,
      stretches: [{ left: (10 / 30) * 100, width: (20 / 30) * 100, kind: "away" }],
    });
  });
});
