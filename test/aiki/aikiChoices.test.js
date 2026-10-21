import { describe, it, expect } from "vitest";
import { aikiChoices } from "../../src/aiki/aikiChoices";

const kinds = (choices) => choices.map((c) => c.kind);

describe("aikiChoices", () => {
  it("offers exercises, then the lesson, then the unfinished article", () => {
    const choices = aikiChoices({
      exercisesDue: 6,
      lesson: { lesson_id: 1, title: "Ved bageren", duration_seconds: 240 },
      unfinishedArticles: [{ id: 7, title: "A", last_reading_percentage: 0.4 }],
    });
    expect(kinds(choices)).toEqual(["exercises", "lesson", "article"]);
    expect(choices[0].meta).toBe("6 words due");
    expect(choices[1]).toMatchObject({ kicker: "Audio lesson", title: "Ved bageren", meta: "4 min" });
    expect(choices[2]).toMatchObject({ progress: 40, href: "/read/article?id=7" });
  });

  it("always offers the lesson, even with nothing else", () => {
    const choices = aikiChoices({ exercisesDue: 0, lesson: null, unfinishedArticles: [] });
    expect(kinds(choices)).toEqual(["lesson"]);
    expect(choices[0].meta).toBe("Make today's lesson");
  });

  it("offers a lesson already heard as one to listen to again", () => {
    const [lesson] = aikiChoices({
      exercisesDue: 0,
      lesson: { lesson_id: 1, title: "T", duration_seconds: 300, is_completed: true },
    });
    expect(lesson.meta).toBe("Listen again · 5 min");
  });
});
