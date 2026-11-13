import { describe, it, expect } from "vitest";
import { doneTodayFrom, reminderText, reminderTimes } from "../../src/reminder/studyReminder";

const morning = new Date(2026, 10, 13, 9, 0);
const evening = new Date(2026, 10, 13, 20, 0);

describe("reminderTimes", () => {
  it("reminds today and the next six days at the chosen time", () => {
    const times = reminderTimes(morning, "19:00", false);
    expect(times).toHaveLength(7);
    expect(times[0]).toEqual(new Date(2026, 10, 13, 19, 0));
    expect(times[6]).toEqual(new Date(2026, 10, 19, 19, 0));
  });

  it("leaves today out once the goal is met", () => {
    const times = reminderTimes(morning, "19:00", true);
    expect(times).toHaveLength(6);
    expect(times[0]).toEqual(new Date(2026, 10, 14, 19, 0));
  });

  it("leaves today out once its time has passed", () => {
    expect(reminderTimes(evening, "19:00", false)[0]).toEqual(new Date(2026, 10, 14, 19, 0));
  });

  it("crosses into the next month", () => {
    const times = reminderTimes(new Date(2026, 10, 28, 6, 0), "07:30", false);
    expect(times[6]).toEqual(new Date(2026, 11, 4, 7, 30));
  });
});

describe("doneTodayFrom", () => {
  it("is done once any language was practiced today", () => {
    expect(doneTodayFrom([{ practiced_today: false }, { practiced_today: true }])).toBe(true);
    expect(doneTodayFrom([{ practiced_today: false }])).toBe(false);
  });

  it("is not done without an answer", () => {
    expect(doneTodayFrom(null)).toBe(false);
  });
});

describe("reminderText", () => {
  it("names the language and the goal", () => {
    expect(reminderText(10, "Danish")).toEqual({
      title: "Time for Danish",
      body: "10 minutes keep your streak going.",
    });
  });
});
