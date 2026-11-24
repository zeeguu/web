import { describe, it, expect } from "vitest";
import { shouldOfferReminder } from "../../src/reminder/reminderOffer";

const now = new Date(2026, 10, 24, 18, 0);
const base = { available: true, enabled: false, goalMinutes: 10, permission: "prompt", lastOfferedOn: null, now };

describe("shouldOfferReminder", () => {
  it("offers on a phone that was never asked", () => {
    expect(shouldOfferReminder(base)).toBe(true);
  });

  it("offers when notifications are allowed but the reminder is off", () => {
    expect(shouldOfferReminder({ ...base, permission: "granted" })).toBe(true);
  });

  it("does not offer when the reminder is already on", () => {
    expect(shouldOfferReminder({ ...base, enabled: true })).toBe(false);
  });

  it("does not offer when the phone refused: the app can no longer ask", () => {
    expect(shouldOfferReminder({ ...base, permission: "denied" })).toBe(false);
  });

  it("does not offer on the web, or without a goal", () => {
    expect(shouldOfferReminder({ ...base, available: false })).toBe(false);
    expect(shouldOfferReminder({ ...base, goalMinutes: null })).toBe(false);
  });

  it("after 'Not now', waits a week", () => {
    expect(shouldOfferReminder({ ...base, lastOfferedOn: "2026-11-24" })).toBe(false);
    expect(shouldOfferReminder({ ...base, lastOfferedOn: "2026-11-18" })).toBe(false);
    expect(shouldOfferReminder({ ...base, lastOfferedOn: "2026-11-17" })).toBe(true);
  });

  it("counts the week across a month boundary", () => {
    const december = new Date(2026, 11, 3, 18, 0);
    expect(shouldOfferReminder({ ...base, now: december, lastOfferedOn: "2026-11-27" })).toBe(false);
    expect(shouldOfferReminder({ ...base, now: december, lastOfferedOn: "2026-11-26" })).toBe(true);
  });
});
