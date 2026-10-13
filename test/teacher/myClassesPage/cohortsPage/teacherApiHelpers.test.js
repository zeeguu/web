import { describe, it, expect } from "vitest";
import {
  activitySegments,
  transformStudents,
} from "../../../../src/teacher/myClassesPage/cohortsPage/teacherApiHelpers";

describe("activitySegments", () => {
  it("splits a student's time by kind, leaving out kinds with none", () => {
    const segments = activitySegments({ reading_time: 60, exercise_time: 0, browsing_time: 180, audio_time: 0 });
    expect(segments).toEqual([
      { kind: "reading_time", seconds: 60, percent: 25 },
      { kind: "browsing_time", seconds: 180, percent: 75 },
    ]);
  });

  it("shows a browsing-only student, who looked idle before", () => {
    expect(activitySegments({ reading_time: 0, exercise_time: 0, browsing_time: 360 }).map((s) => s.kind)).toEqual([
      "browsing_time",
    ]);
  });

  it("has nothing for a student with no time", () => {
    expect(activitySegments({ reading_time: 0, exercise_time: 0 })).toEqual([]);
  });
});

describe("transformStudents", () => {
  it("scales each bar to the class's most active student, all kinds counted", () => {
    const [busy, browser] = transformStudents([
      { reading_time: 600, exercise_time: 600, browsing_time: 0, audio_time: 0 },
      { reading_time: 0, exercise_time: 0, browsing_time: 300, audio_time: 300 },
    ]);
    expect(busy.total_time).toBe(1200);
    expect(browser.total_time).toBe(600);
    expect(browser.normalized_activity_proportion).toBe(50);
  });
});
