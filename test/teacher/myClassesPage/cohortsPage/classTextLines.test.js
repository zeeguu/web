import { describe, expect, it } from "vitest";
import {
  classTextSubtitle,
  readerDetails,
  readingTimeSummary,
  readingTimes,
  thresholdOptions,
  heatColor,
  studentsByToken,
  classReadingSummary,
} from "../../../../src/teacher/myClassesPage/cohortsPage/classTextLines";

describe("classTextSubtitle", () => {
  it("says how much of the class read it, for how long, and how many words they needed", () => {
    const readers = [{ reading_seconds: 120 }, { reading_seconds: 360 }];
    expect(classTextSubtitle({ readers, words: [{}, {}, {}], student_count: 12 })).toEqual({
      readers: "Read by 2 of 12 students",
      time: "median 4 min (2 min – 6 min)",
      words: "3 words looked up",
    });
  });

  it("leaves out the time and the words when there are none", () => {
    expect(classTextSubtitle({ readers: [], words: [], student_count: 1 })).toEqual({
      readers: "Read by 0 of 1 student",
      time: null,
      words: null,
    });
  });
});

describe("readingTimes", () => {
  it("lists the students who spent any time, longest first", () => {
    const readers = [
      { id: 1, name: "Ana", reading_seconds: 60 },
      { id: 2, name: "Max", reading_seconds: 0 },
      { id: 3, name: "Sofie", reading_seconds: 300 },
    ];
    expect(readingTimes(readers).map((r) => r.name)).toEqual(["Sofie", "Ana"]);
  });
});

describe("readerDetails", () => {
  it("joins what the student did", () => {
    expect(readerDetails({ reading_completion: 0.8, reading_seconds: 300, translations: 1 })).toBe(
      "read 80% · 5 min · 1 word",
    );
  });

  it("still says something for a student who only opened it", () => {
    expect(readerDetails({ reading_completion: 0, reading_seconds: 0, translations: 0 })).toBe("opened it");
  });
});

describe("heatmap helpers", () => {
  it("offers only the thresholds some word reaches", () => {
    expect(thresholdOptions(4)).toEqual([1, 2, 3]);
    expect(thresholdOptions(15)).toEqual([1, 2, 3, 5, 10]);
  });

  it("goes from green for one student to red for the most looked-up", () => {
    expect(heatColor(1, 15)).toBe("hsla(120, 85%, 50%, 0.25)");
    expect(heatColor(15, 15)).toBe("hsla(0, 85%, 50%, 0.60)");
    expect(heatColor(1, 1)).toBe("hsla(120, 85%, 50%, 0.25)");
  });

  it("places each student's bookmark on its tokens, a student counting once", () => {
    const words = ["stellt", "sich", "hinter", "Präsident"];
    const part = {
      tokens: [[words.map((text, token_i) => ({ text, sent_i: 0, token_i }))]],
      class_bookmarks: [
        { student_id: 7, origin: "hinter", translation: "behind", context_sent: 0, context_token: 0, t_sentence_i: 0, t_token_i: 2, t_total_token: 1 },
        { student_id: 7, origin: "hinter", translation: "after", context_sent: 0, context_token: 0, t_sentence_i: 0, t_token_i: 2, t_total_token: 1 },
        { student_id: 9, origin: "hinter Präsident", translation: "behind the president", context_sent: 0, context_token: 0, t_sentence_i: 0, t_token_i: 2, t_total_token: 2 },
        { student_id: 9, origin: "gone", translation: "weg", context_sent: 0, context_token: 0, t_sentence_i: 0, t_token_i: 9, t_total_token: 1 },
      ],
    };
    const byToken = studentsByToken(part);
    expect(byToken.get("0:2")).toEqual([
      { id: 7, translation: "behind" },
      { id: 9, translation: "behind the president" },
    ]);
    expect(byToken.get("0:3")).toEqual([{ id: 9, translation: "behind the president" }]);
    expect(byToken.size).toBe(2);
  });
});

describe("readingTimeSummary", () => {
  const read = (...minutes) => minutes.map((m) => ({ reading_seconds: m * 60 }));

  it("gives the median and the range", () => {
    expect(readingTimeSummary(read(2, 6, 15))).toBe("median 6 min (2 min – 15 min)");
    expect(readingTimeSummary(read(2, 4, 8, 15))).toBe("median 6 min (2 min – 15 min)");
  });

  it("leaves out students who spent no time, and says nothing when nobody did", () => {
    expect(readingTimeSummary(read(0, 5))).toBe("5 min");
    expect(readingTimeSummary(read(0))).toBe(null);
  });
});

describe("classReadingSummary", () => {
  it("says how many read it and how many words they looked up", () => {
    const summary = classReadingSummary({ readers: 14, words: 37, top_words: ["amply", "chow down"] }, 22);
    expect(summary.line).toBe("Read by 14 of 22 students · 37 words looked up");
    expect(summary.share).toBeCloseTo(14 / 22);
    expect(summary.topWords).toBe("amply, chow down");
  });

  it("says nobody has read it, and leaves out the lookups, before anyone has", () => {
    const summary = classReadingSummary({ readers: 0, words: 0, top_words: [] }, 22);
    expect(summary.line).toBe("Nobody has read it yet");
    expect(summary.topWords).toBeNull();
  });

  it("does not divide by an empty class", () => {
    expect(classReadingSummary({ readers: 0, words: 0, top_words: [] }, 0).share).toBe(0);
  });
});
