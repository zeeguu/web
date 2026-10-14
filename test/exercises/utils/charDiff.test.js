import { describe, it, expect } from "vitest";
import { charDiff, isCloseMiss } from "../../../src/exercises/utils/charDiff";

const show = (ops) => ops.map((o) => (o.type === "same" ? o.ch : o.type === "add" ? `+${o.ch}` : `-${o.ch}`)).join("");

describe("charDiff", () => {
  it("marks a missing letter as added", () => {
    expect(show(charDiff("spænende", "spændende"))).toBe("spæn+dende");
  });

  it("marks an extra letter as deleted", () => {
    expect(show(charDiff("huuset", "huset"))).toBe("hu-uset");
  });

  it("ignores case and keeps the expected casing", () => {
    expect(show(charDiff("københavn", "København"))).toBe("København");
  });

  it("treats a different word as not a close miss", () => {
    expect(isCloseMiss(charDiff("tænker", "synes"), "synes")).toBe(false);
    expect(isCloseMiss(charDiff("spænende", "spændende"), "spændende")).toBe(true);
  });
});
