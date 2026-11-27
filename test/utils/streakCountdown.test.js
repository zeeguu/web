import { describe, expect, it } from "vitest";
import { isCountingDown, showsStreakCount, streakCountdownHint, studiedPercent } from "../../src/utils/streakCountdown";

describe("isCountingDown", () => {
  it("counts down until today counts, when the API sent the remaining time", () => {
    expect(isCountingDown(false, 75_000)).toBe(true);
    expect(isCountingDown(false, 120_000)).toBe(true);
  });

  it("stops once today counts", () => {
    expect(isCountingDown(true, 0)).toBe(false);
  });

  it("does not count down without a remaining time (other languages, older API)", () => {
    expect(isCountingDown(false, null)).toBe(false);
    expect(isCountingDown(false, undefined)).toBe(false);
  });
});

describe("studiedPercent", () => {
  it("fills toward the daily goal as the remaining time goes down", () => {
    expect(studiedPercent(600_000, "10")).toBe(0);
    expect(studiedPercent(300_000, "10")).toBe(50);
    expect(studiedPercent(0, "10")).toBe(100);
  });

  it("uses the default goal before the preferences have loaded", () => {
    expect(studiedPercent(150_000, undefined)).toBe(50);
  });

  it("stays within 0 and 100 when the goal changed during the day", () => {
    expect(studiedPercent(900_000, "5")).toBe(0);
  });
});

describe("streakCountdownHint", () => {
  it("rounds up to whole minutes, never below one", () => {
    expect(streakCountdownHint(75_000, 7)).toBe("2 more minutes of study today keeps your streak");
    expect(streakCountdownHint(60_000, 7)).toBe("1 more minute of study today keeps your streak");
    expect(streakCountdownHint(5_000, 7)).toBe("1 more minute of study today keeps your streak");
  });

  it("talks about starting a streak when there is none", () => {
    expect(streakCountdownHint(120_000, 0)).toBe("2 more minutes of study today starts a streak");
  });
});

describe("showsStreakCount", () => {
  it("shows it unless the learner turned it off", () => {
    expect(showsStreakCount(undefined)).toBe(true);
    expect(showsStreakCount({})).toBe(true);
    expect(showsStreakCount({ show_streak_count: "true" })).toBe(true);
    expect(showsStreakCount({ show_streak_count: "false" })).toBe(false);
  });
});
