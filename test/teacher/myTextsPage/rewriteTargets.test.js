import { describe, expect, it } from "vitest";
import { isInBetweenLevel, rewriteTargets } from "../../../src/teacher/myTextsPage/rewriteTargets";

describe("rewriteTargets", () => {
  it("offers every easier level and the in-between one just below the original", () => {
    expect(rewriteTargets("B2")).toEqual(["A1", "A2", "B1", "B1/B2"]);
    expect(rewriteTargets("A2")).toEqual(["A1", "A1/A2"]);
  });

  it("reads a compound original as its harder end, without an in-between target", () => {
    expect(rewriteTargets("B1/B2")).toEqual(["A1", "A2", "B1"]);
  });

  it("offers nothing for A1 or an unknown level", () => {
    expect(rewriteTargets("A1")).toEqual([]);
    expect(rewriteTargets("")).toEqual([]);
    expect(rewriteTargets("X9")).toEqual([]);
  });
});

describe("isInBetweenLevel", () => {
  it("tells compound targets from plain levels", () => {
    expect(isInBetweenLevel("B1/B2")).toBe(true);
    expect(isInBetweenLevel("B1")).toBe(false);
  });
});
