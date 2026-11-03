import { describe, it, expect } from "vitest";
import {
  activityKindsShown,
  barWidthPercent,
  levelText,
  studentsDifferInLevel,
  correctText,
  daysInactive,
  lastActiveText,
  minutesText,
} from "../../../../src/teacher/myClassesPage/cohortsPage/studentRowText";

const now = new Date(2026, 9, 13, 20, 0);

describe("lastActiveText", () => {
  it("speaks in days", () => {
    expect(lastActiveText(null, now)).toBe("never");
    expect(lastActiveText("2026-10-13T08:00:00Z", now)).toBe("today");
    expect(lastActiveText("2026-10-12T08:00:00Z", now)).toBe("yesterday");
    expect(lastActiveText("2026-10-01T08:00:00Z", now)).toBe("12 days ago");
    expect(lastActiveText("2026-06-01T08:00:00Z", now)).toBe("4 months ago");
  });
});

describe("daysInactive", () => {
  it("puts never-active students last-seen-longest", () => {
    expect(daysInactive(null, now)).toBe(Infinity);
    expect(daysInactive("2026-10-12T20:00:00", now)).toBeCloseTo(1, 0);
  });
});

describe("correctText", () => {
  it("needs enough exercises to say anything", () => {
    expect(correctText({ number_of_exercises: 4, correct_on_1st_try: 0.5 })).toBe("–");
    expect(correctText({ number_of_exercises: 21, correct_on_1st_try: 0.62 })).toBe("62%");
  });
});

describe("minutesText and barWidthPercent", () => {
  it("formats and scales", () => {
    expect(minutesText(0)).toBe("–");
    expect(minutesText(1318)).toBe("22 min");
    expect(minutesText(3900)).toBe("1 h 5 min");
    expect(barWidthPercent(0, 3900)).toBe(0);
    expect(barWidthPercent(10, 3900)).toBe(3);
    expect(barWidthPercent(1950, 3900)).toBe(50);
  });
});

describe("levelText", () => {
  it("names the 0..6 levels, A0 included", () => {
    expect(levelText(0)).toBe("A0");
    expect(levelText(3)).toBe("B1");
    expect(levelText(6)).toBe("C2");
  });
  it("shows a dash for a level never set", () => {
    expect(levelText(null)).toBe("–");
    expect(levelText(undefined)).toBe("–");
  });
});

describe("studentsDifferInLevel", () => {
  it("is false when everyone is on the same level", () => {
    expect(studentsDifferInLevel([{ cefr_level: 2 }, { cefr_level: 2 }])).toBe(false);
  });
  it("ignores students who never set a level", () => {
    expect(studentsDifferInLevel([{ cefr_level: 2 }, { cefr_level: null }, {}])).toBe(false);
  });
  it("is true for a mixed class, A0 counting as a level", () => {
    expect(studentsDifferInLevel([{ cefr_level: 0 }, { cefr_level: 3 }])).toBe(true);
  });
});

describe("activityKindsShown", () => {
  const ALL = [{ key: "reading" }, { key: "exercise" }, { key: "browsing" }, { key: "audio" }];
  it("keeps the kinds some student has, in legend order", () => {
    const students = [
      { activity_segments: [{ kind: "audio_time" }, { kind: "exercise_time" }] },
      { activity_segments: [{ kind: "exercise_time" }] },
      {},
    ];
    expect(activityKindsShown(students, ALL).map((k) => k.key)).toEqual(["exercise", "audio"]);
  });
});
