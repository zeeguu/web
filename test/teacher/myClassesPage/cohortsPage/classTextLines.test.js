import { describe, expect, it } from "vitest";
import {
  classTextSubtitle,
  readerDetails,
  readingTimeSummary,
  thresholdOptions,
  heatColor,
  lookupsByToken,
} from "../../../../src/teacher/myClassesPage/cohortsPage/classTextLines";

describe("classTextSubtitle", () => {
  it("says how much of the class read it and how many words they needed", () => {
    expect(classTextSubtitle({ readers: [{}, {}], words: [{}, {}, {}], student_count: 12 })).toBe(
      "Read by 2 of 12 students · 3 words looked up",
    );
  });

  it("leaves out the words when nobody looked any up", () => {
    expect(classTextSubtitle({ readers: [], words: [], student_count: 1 })).toBe("Read by 0 of 1 student");
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

  it("indexes lookups by token", () => {
    const map = lookupsByToken([{ sent_i: 0, token_i: 2, students: [7, 9] }]);
    expect(map.get("0:2")).toEqual([7, 9]);
    expect(lookupsByToken(undefined).size).toBe(0);
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
