import { describe, it, expect } from "vitest";
import { aikiStep, countsAsLearning, describePicked, pickedCount } from "../../src/components/nativeShield";

describe("aikiStep", () => {
  it("is unsupported off iOS 16 or before the status is known", () => {
    expect(aikiStep(null)).toBe("unsupported");
    expect(aikiStep({ supported: false })).toBe("unsupported");
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
  it("counts reading, exercises and listening, not browsing or watching", () => {
    expect(countsAsLearning("reading", 10)).toBe(true);
    expect(countsAsLearning("exercise", 10)).toBe(true);
    expect(countsAsLearning("listening", 10)).toBe(true);
    expect(countsAsLearning("browsing", 10)).toBe(false);
    expect(countsAsLearning("watching", 10)).toBe(false);
  });

  it("ignores time that did not move forward", () => {
    expect(countsAsLearning("reading", 0)).toBe(false);
    expect(countsAsLearning("reading", -5)).toBe(false);
  });
});
