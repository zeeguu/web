import { describe, it, expect } from "vitest";
import {
  dayKey,
  doneTodayFrom,
  openedReminderEvent,
  reminderPreferencesToSync,
  reminderText,
  reminderTimes,
  settingFromServer,
} from "../../src/reminder/studyReminder";

const morning = new Date(2026, 10, 13, 9, 0);
const evening = new Date(2026, 10, 13, 20, 0);

describe("reminderTimes", () => {
  it("reminds today and the next six days at the chosen time", () => {
    const times = reminderTimes(morning, "19:00", false);
    expect(times).toHaveLength(7);
    expect(times[0]).toEqual(new Date(2026, 10, 13, 19, 0));
    expect(times[6]).toEqual(new Date(2026, 10, 19, 19, 0));
  });

  it("leaves today out once the goal is met", () => {
    const times = reminderTimes(morning, "19:00", true);
    expect(times).toHaveLength(6);
    expect(times[0]).toEqual(new Date(2026, 10, 14, 19, 0));
  });

  it("leaves today out once its time has passed", () => {
    expect(reminderTimes(evening, "19:00", false)[0]).toEqual(new Date(2026, 10, 14, 19, 0));
  });

  it("crosses into the next month", () => {
    const times = reminderTimes(new Date(2026, 10, 28, 6, 0), "07:30", false);
    expect(times[6]).toEqual(new Date(2026, 11, 4, 7, 30));
  });
});

describe("doneTodayFrom", () => {
  it("is done once any language was practiced today", () => {
    expect(doneTodayFrom([{ practiced_today: false }, { practiced_today: true }])).toBe(true);
    expect(doneTodayFrom([{ practiced_today: false }])).toBe(false);
  });

  it("is not done without an answer", () => {
    expect(doneTodayFrom(null)).toBe(false);
  });
});

describe("reminderText", () => {
  it("names the language and the goal", () => {
    expect(reminderText(10, "Danish")).toEqual({
      id: "goal-v1",
      title: "Time for Danish",
      body: "10 minutes keep your streak going.",
    });
  });
});

describe("reminderPreferencesToSync", () => {
  const on = { enabled: true, time: "07:30" };

  it("sends what the server does not have yet", () => {
    expect(reminderPreferencesToSync(on, "granted", {})).toEqual({
      study_reminder_enabled: "true",
      study_reminder_time: "07:30",
      notifications_permission: "granted",
    });
  });

  it("sends only what changed", () => {
    const server = {
      study_reminder_enabled: "true",
      study_reminder_time: "07:30",
      notifications_permission: "granted",
    };
    expect(reminderPreferencesToSync(on, "granted", server)).toEqual({});
    expect(reminderPreferencesToSync(on, "denied", server)).toEqual({ notifications_permission: "denied" });
  });

  it("reports Android's rationale prompt as not asked yet", () => {
    expect(reminderPreferencesToSync(on, "prompt-with-rationale", {}).notifications_permission).toBe("prompt");
  });
});

describe("openedReminderEvent", () => {
  it("logs the text and when the reminder was due", () => {
    const notification = {
      extra: { kind: "study_reminder", textId: "goal-v1", scheduledFor: "2026-11-13T18:00:00.000Z", test: false },
    };
    expect(openedReminderEvent(notification)).toEqual({
      textId: "goal-v1",
      details: '{"scheduled_for":"2026-11-13T18:00:00.000Z","test":false}',
    });
  });

  it("ignores other notifications", () => {
    expect(openedReminderEvent({ extra: { kind: "something_else" } })).toBeNull();
    expect(openedReminderEvent({})).toBeNull();
  });
});

describe("dayKey", () => {
  it("is the local day, so being done today expires at midnight", () => {
    expect(dayKey(new Date(2026, 10, 13, 23, 59))).toBe("2026-11-13");
    expect(dayKey(new Date(2026, 10, 14, 0, 1))).toBe("2026-11-14");
  });
});

describe("settingFromServer", () => {
  const server = { study_reminder_enabled: "true", study_reminder_time: "07:30" };

  it("restores the learner's reminder on a phone that has none", () => {
    expect(settingFromServer(server, "granted")).toEqual({ enabled: true, time: "07:30" });
  });

  it("keeps it off while the phone may not show notifications", () => {
    expect(settingFromServer(server, "prompt")).toEqual({ enabled: false, time: "07:30" });
  });

  it("has nothing to restore when the server has no setting", () => {
    expect(settingFromServer({}, "granted")).toBeNull();
  });
});
