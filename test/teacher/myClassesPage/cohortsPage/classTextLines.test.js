import { describe, expect, it } from "vitest";
import {
  classTextSubtitle,
  readerDetails,
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
