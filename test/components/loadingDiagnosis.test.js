import { describe, expect, it } from "vitest";
import { diagnosePrefix, drillCaption } from "../../src/components/LoadingAnimation";

describe("the loading diagnosis", () => {
  it("does not blame the connection when our server answers fast", () => {
    // a long LLM call: /ping is fast, the probe to 1.1.1.1 is slow or blocked
    expect(diagnosePrefix("slow", "fast")).toBe(null);
    expect(diagnosePrefix("failed", "fast")).toBe(null);
    expect(drillCaption("failed", "fast")).toBe("While waiting, remember some of your words…");
  });

  it("blames the connection when our server is slow to answer too", () => {
    expect(diagnosePrefix("slow", "slow")).toBe("Your connection seems slow.");
    expect(drillCaption("slow", "slow")).toBe("Slow connection — while waiting, remember some of your words…");
  });

  it("says offline when nothing answers", () => {
    expect(diagnosePrefix("failed", "failed")).toBe("You may be offline.");
    expect(drillCaption("failed", "failed")).toBe("While waiting, remember some of your words…");
  });

  it("blames our server when only it is slow", () => {
    expect(diagnosePrefix("fast", "slow")).toBe("Our server is taking a bit longer than usual.");
  });
});
