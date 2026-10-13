import { describe, it, expect } from "vitest";
import { periodRange, periodLabel } from "../../../src/words/sessionHistory/periodRange";

const now = new Date(2026, 9, 15, 14, 30); // Thu 15 Oct 2026, 14:30 local

describe("periodRange", () => {
  it("counts days back from now", () => {
    const { fromDate, toDate } = periodRange("7", null, now);
    expect(toDate).toBe(now);
    expect(now - fromDate).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("starts this week on Monday at midnight", () => {
    const { fromDate } = periodRange("week", null, now);
    expect([fromDate.getDate(), fromDate.getHours()]).toEqual([12, 0]);
  });

  it("covers a custom range's last day whole, in local time", () => {
    const { fromDate, toDate } = periodRange("custom", { from: "2026-10-01", to: "2026-10-10" }, now);
    expect([fromDate.getDate(), fromDate.getHours()]).toEqual([1, 0]);
    expect([toDate.getDate(), toDate.getHours(), toDate.getMinutes()]).toEqual([10, 23, 59]);
  });

  it("has no range for a custom period not yet applied", () => {
    expect(periodRange("custom", null, now)).toBe(null);
  });
});

describe("periodLabel", () => {
  it("names presets and applied ranges", () => {
    expect(periodLabel("365")).toBe("Last year");
    expect(periodLabel("custom", { from: "2026-10-01", to: "2026-10-10" })).toBe("2026-10-01 to 2026-10-10");
  });
});
