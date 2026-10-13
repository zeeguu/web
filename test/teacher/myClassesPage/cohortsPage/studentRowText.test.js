import { describe, it, expect } from "vitest";
import {
  barWidthPercent,
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
