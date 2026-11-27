import { parseLessonDate, lessonHasDialogue } from "../../src/dailyAudio/audioUtils";

// The Current tab used to print "Today" unconditionally, so a lesson held over
// from an earlier day (the paused-waiting-for-engagement case) claimed to have
// been made this morning. These cover the label being driven by created_at.
describe("parseLessonDate", () => {
  test("reads a zone-less timestamp as UTC, not local", () => {
    expect(parseLessonDate("2026-09-06T22:30:00").toISOString()).toBe("2026-09-06T22:30:00.000Z");
  });

  test("leaves an explicit zone alone", () => {
    expect(parseLessonDate("2026-09-06T22:30:00+02:00").toISOString()).toBe("2026-09-06T20:30:00.000Z");
  });
});

describe("lessonHasDialogue", () => {
  it("is true for topic and situation lessons, which are a dialogue", () => {
    expect(lessonHasDialogue({ lesson_type: "topic" })).toBe(true);
    expect(lessonHasDialogue({ lesson_type: "situation" })).toBe(true);
  });

  it("is false for a three-words lesson and for no lesson", () => {
    expect(lessonHasDialogue({ lesson_type: "three_words_lesson" })).toBe(false);
    expect(lessonHasDialogue(undefined)).toBe(false);
  });
});
