import { describe, it, expect } from "vitest";
import {
  aikiStep,
  chosenDailyGoal,
  countsAsLearning,
  describePicked,
  pickedCount,
} from "../../src/components/nativeShield";

describe("aikiStep", () => {
  it("is unsupported off iOS 16 or before the status is known", () => {
    expect(aikiStep(null)).toBe("unsupported");
    expect(aikiStep({ supported: false })).toBe("unsupported");
  });

  it("asks for a daily goal before setting Aiki up", () => {
    expect(aikiStep({ supported: true, authorization: "notDetermined" }, false)).toBe("goal");
    expect(aikiStep({ supported: true, authorization: "approved", apps: 0 }, false)).toBe("goal");
    expect(aikiStep({ supported: false }, false)).toBe("unsupported");
  });

  it("keeps the controls of a learner who set Aiki up before choosing a goal", () => {
    expect(aikiStep({ supported: true, authorization: "approved", apps: 2 }, false)).toBe("ready");
  });

  it("asks for access until it is approved", () => {
    expect(aikiStep({ supported: true, authorization: "notDetermined", apps: 2 })).toBe("authorize");
    expect(aikiStep({ supported: true, authorization: "denied" })).toBe("authorize");
  });

  it("asks to pick apps when nothing is picked", () => {
    expect(aikiStep({ supported: true, authorization: "approved", apps: 0, categories: 0, webDomains: 0 })).toBe(
      "pick",
    );
  });

  it("is ready once a category alone is picked", () => {
    expect(aikiStep({ supported: true, authorization: "approved", apps: 0, categories: 1, webDomains: 0 })).toBe(
      "ready",
    );
  });
});

describe("describePicked", () => {
  it("names what was picked, in plural where needed", () => {
    expect(describePicked({ apps: 1, categories: 0, webDomains: 0 })).toBe("1 app");
    expect(describePicked({ apps: 2, categories: 1, webDomains: 0 })).toBe("2 apps and 1 category");
    expect(describePicked({ apps: 0, categories: 2, webDomains: 3 })).toBe("2 categories and 3 websites");
  });

  it("counts everything picked", () => {
    expect(pickedCount({ apps: 2, categories: 1, webDomains: 1 })).toBe(4);
    expect(pickedCount(undefined)).toBe(0);
  });
});

describe("countsAsLearning", () => {
  it("counts every activity session, as the streak does", () => {
    for (const label of ["reading", "exercise", "listening", "browsing", "watching"]) {
      expect(countsAsLearning(label, 10)).toBe(true);
    }
    expect(countsAsLearning("something-else", 10)).toBe(false);
  });

  it("ignores time that did not move forward", () => {
    expect(countsAsLearning("reading", 0)).toBe(false);
    expect(countsAsLearning("reading", -5)).toBe(false);
  });
});

describe("chosenDailyGoal", () => {
  it("is the learner's goal, chosen or the default", () => {
    expect(chosenDailyGoal({ daily_goal_set: "true", daily_goal_minutes: "10" })).toBe(10);
    expect(chosenDailyGoal({ daily_goal_set: "false", daily_goal_minutes: "5" })).toBe(5);
  });

  it("is null for the grandfathered 2 minutes, or with no preferences", () => {
    expect(chosenDailyGoal({ daily_goal_set: "false", daily_goal_minutes: "2" })).toBe(null);
    expect(chosenDailyGoal(undefined)).toBe(null);
  });
});
