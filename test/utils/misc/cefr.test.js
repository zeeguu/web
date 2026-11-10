import { describe, it, expect } from "vitest";
import {
  LEVELS,
  STORED_LEVELS,
  below,
  combine,
  fromNumber,
  isAbove,
  isLevel,
  rank,
  readable,
  single,
  toNumber,
} from "../../../src/utils/misc/cefr";

// The web's twin of the API's zeeguu/core/cefr.py (and its test_cefr.py).

describe("rank", () => {
  it("orders the levels", () => {
    expect(LEVELS.map(rank)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("counts a split level as the higher one", () => {
    expect(rank("B1/B2")).toBe(rank("B2"));
    expect(single("B1/B2")).toBe("B2");
    expect(isAbove("B1/B2", "B1")).toBe(true);
  });

  it("is null for anything that is not a level", () => {
    for (const value of [undefined, null, "", "A0", "b1", "easy", 3]) {
      expect(rank(value)).toBeNull();
      expect(single(value)).toBeNull();
      expect(below(value)).toEqual([]);
    }
    expect(isLevel("B1/B2")).toBe(false);
    expect(isAbove("C2", undefined)).toBe(false);
  });
});

describe("below", () => {
  it("lists the easier levels, easiest first", () => {
    expect(below("A1")).toEqual([]);
    expect(below("B2")).toEqual(["A1", "A2", "B1"]);
    expect(below("B1/B2")).toEqual(["A1", "A2", "B1"]);
  });
});

describe("readable", () => {
  it("reads A0 as A1 and a split level as its higher part", () => {
    expect(readable("A0")).toBe("A1");
    expect(readable("B1")).toBe("B1");
    expect(readable("B1/B2")).toBe("B2");
    expect(readable(undefined)).toBeNull();
  });
});

describe("combine", () => {
  it("is the API's rule for two assessments", () => {
    expect(combine("B1", "B1")).toBe("B1");
    expect(combine("B2", "B1")).toBe("B1/B2");
    expect(combine("A1", "B1")).toBe("B1");
    expect(combine("A2", null)).toBe("A2");
    expect(combine(undefined, "C1")).toBe("C1");
    expect(combine(null, null)).toBeNull();
  });
});

describe("stored numbers", () => {
  it("reads 0..6, as numbers or strings, as A0..C2", () => {
    expect(fromNumber(0)).toBe("A0");
    expect(fromNumber("0")).toBe("A0");
    expect(fromNumber(6)).toBe("C2");
    expect(fromNumber("3")).toBe("B1");
  });

  it("is null for anything else -- never A0 for nothing", () => {
    for (const value of [undefined, null, "", 7, -1, 2.5, "B1", true]) {
      expect(fromNumber(value)).toBeNull();
    }
  });

  it("round-trips", () => {
    expect(STORED_LEVELS.map(toNumber)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(toNumber("B1/B2")).toBeNull();
  });
});
