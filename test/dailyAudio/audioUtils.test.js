import { lessonDateLabel, parseLessonDate } from "../../src/dailyAudio/audioUtils";

// The Current tab used to print "Today" unconditionally, so a lesson held over
// from an earlier day (the paused-waiting-for-engagement case) claimed to have
// been made this morning. These cover the label being driven by created_at.
describe("lessonDateLabel", () => {
  const isoDaysAgo = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    // Same wire shape the API sends: naive UTC, no zone designator.
    return d.toISOString().replace("Z", "");
  };

  test("says Today only for a lesson made today", () => {
    expect(lessonDateLabel(isoDaysAgo(0))).toMatch(/^Today · /);
  });

  test("says Yesterday for the previous day", () => {
    expect(lessonDateLabel(isoDaysAgo(1))).toMatch(/^Yesterday · /);
  });

  test("counts the days for the rest of the week", () => {
    expect(lessonDateLabel(isoDaysAgo(4))).toMatch(/^4 days ago · /);
    expect(lessonDateLabel(isoDaysAgo(6))).toMatch(/^6 days ago · /);
  });

  test("drops the relative half once the count stops meaning anything", () => {
    const label = lessonDateLabel(isoDaysAgo(40));
    expect(label).not.toMatch(/ago|Today|Yesterday/);
    expect(label).toMatch(/^\w{3}, \w{3} \d{1,2}$/);
  });

  test("never says '-1 days ago' for a clock-skewed future timestamp", () => {
    expect(lessonDateLabel(isoDaysAgo(-2))).toMatch(/^\w{3}, \w{3} \d{1,2}$/);
  });

  test("renders nothing when the lesson has no timestamp", () => {
    expect(lessonDateLabel(null)).toBe("");
    expect(lessonDateLabel("not-a-date")).toBe("");
  });
});

describe("parseLessonDate", () => {
  test("reads a zone-less timestamp as UTC, not local", () => {
    expect(parseLessonDate("2026-09-06T22:30:00").toISOString()).toBe("2026-09-06T22:30:00.000Z");
  });

  test("leaves an explicit zone alone", () => {
    expect(parseLessonDate("2026-09-06T22:30:00+02:00").toISOString()).toBe("2026-09-06T20:30:00.000Z");
  });
});
