import { describe, it, expect } from "vitest";
import {
  studentArticleHeader,
  translationCount,
} from "../../../../src/teacher/myClassesPage/activityPage/studentArticleHeader";

const bookmarks = (n) => ({ past_bookmarks: Array(n).fill({}) });

describe("translationCount", () => {
  it("counts the title's and every paragraph's translations", () => {
    expect(translationCount({ tokenized_title_new: bookmarks(1), tokenized_fragments: [bookmarks(2), {}] })).toBe(3);
  });
});

describe("studentArticleHeader", () => {
  it("says who translated, how long, how far", () => {
    const article = {
      tokenized_title_new: bookmarks(0),
      tokenized_fragments: [bookmarks(12)],
      student_reading_seconds: 300,
      reading_completion: 1,
    };
    expect(studentArticleHeader("Max", article)).toEqual({
      lead: "Max's translations are shown above the words.",
      details: "Max spent 5 min on it and read 100% · 12 words translated",
    });
  });

  it("one word, no time recorded", () => {
    const article = { tokenized_title_new: bookmarks(1), tokenized_fragments: [], reading_completion: 0.55 };
    expect(studentArticleHeader("Max", article).details).toBe("Max read 55% · 1 word translated");
  });

  it("no translations, nothing measured", () => {
    expect(studentArticleHeader("Max", { tokenized_title_new: {}, tokenized_fragments: [] })).toEqual({
      lead: "Max translated no words in this text.",
      details: null,
    });
  });
});
