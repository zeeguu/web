import { describe, it, expect } from "vitest";
import { applyChanges, undoChanges } from "../../../src/utils/preferences/savePreferences";

const loaded = { daily_goal_minutes: "5", study_reminder_time: "19:00" };

describe("applyChanges", () => {
  it("applies the changes and remembers what those keys were", () => {
    expect(applyChanges(loaded, { study_reminder_time: "07:30" })).toEqual({
      next: { daily_goal_minutes: "5", study_reminder_time: "07:30" },
      previous: { study_reminder_time: "19:00" },
    });
  });

  it("changes nothing when the preferences are not loaded, or after logging out", () => {
    expect(applyChanges({}, { study_reminder_enabled: "true" })).toEqual({ next: {}, previous: null });
  });
});

describe("undoChanges", () => {
  const changes = { study_reminder_time: "07:30" };
  const previous = { study_reminder_time: "19:00" };

  it("undoes only the failed save's keys", () => {
    const current = { ...loaded, study_reminder_time: "07:30", study_reminder_enabled: "true" };
    expect(undoChanges(current, changes, previous)).toEqual({ ...current, study_reminder_time: "19:00" });
  });

  it("keeps a newer change of the same key", () => {
    const current = { ...loaded, study_reminder_time: "08:00" };
    expect(undoChanges(current, changes, previous)).toBe(current);
  });

  it("keeps what logging out left", () => {
    expect(undoChanges({}, changes, previous)).toEqual({});
  });
});
