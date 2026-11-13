import { Capacitor } from "@capacitor/core";

// The daily study reminder (ADR 046), on the phone only: a local notification
// at the learner's time on each day they have not reached their daily goal yet.
//
// There is no server push. Whenever the app runs it schedules a notification
// for each of the next DAYS_AHEAD days and leaves today's out once the goal is
// met, as /all_language_streaks reports it (so studying on the web counts, if
// the app opens that day). A learner who does not open the app for a week stops
// being reminded, which is gentler than nagging someone who has stopped.
//
// The setting lives on the device, in Capacitor Preferences, since the
// notifications it schedules do too.

export const DEFAULT_REMINDER_TIME = "19:00";
const DAYS_AHEAD = 7;
const FIRST_ID = 4600; // ids FIRST_ID .. FIRST_ID + DAYS_AHEAD - 1 are ours
const SETTING_KEY = "study_reminder";

export function studyReminderAvailable() {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable("LocalNotifications");
}

// When to remind, from `now`: the next DAYS_AHEAD days at `time` ("19:00"),
// leaving out today when it is done or its time has passed.
export function reminderTimes(now, time, doneToday, days = DAYS_AHEAD) {
  const [hours, minutes] = time.split(":").map(Number);
  const times = [];
  for (let day = 0; day < days; day++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, hours, minutes);
    if (day === 0 && (doneToday || at <= now)) continue;
    times.push(at);
  }
  return times;
}

// "Time for Danish" / "10 minutes keep your streak going."
export function reminderText(goalMinutes, language) {
  return {
    title: language ? `Time for ${language}` : "Time to study",
    body: `${goalMinutes} minutes keep your streak going.`,
  };
}

// Today counts once the goal is met in any language: the reminder is about the
// habit, like Aiki, not about one language's streak.
export function doneTodayFrom(streaks) {
  return Array.isArray(streaks) && streaks.some((language) => language.practiced_today);
}

async function plugins() {
  const [{ LocalNotifications }, { Preferences }] = await Promise.all([
    import("@capacitor/local-notifications"),
    import("@capacitor/preferences"),
  ]);
  return { LocalNotifications, Preferences };
}

export async function loadReminderSetting() {
  const off = { enabled: false, time: DEFAULT_REMINDER_TIME };
  if (!studyReminderAvailable()) return off;
  try {
    const { Preferences } = await plugins();
    const { value } = await Preferences.get({ key: SETTING_KEY });
    return value ? { ...off, ...JSON.parse(value) } : off;
  } catch {
    return off;
  }
}

export async function saveReminderSetting(setting) {
  const { Preferences } = await plugins();
  await Preferences.set({ key: SETTING_KEY, value: JSON.stringify(setting) });
}

// Asks iOS (or Android 13+) once; afterwards only the system settings can
// change the answer. Resolves to whether notifications may be shown.
export async function allowReminders() {
  const { LocalNotifications } = await plugins();
  let { display } = await LocalNotifications.checkPermissions();
  if (display === "prompt" || display === "prompt-with-rationale") {
    ({ display } = await LocalNotifications.requestPermissions());
  }
  return display === "granted";
}

// The last facts the app knows, so a resume or a changed setting can
// reschedule without asking the API again.
let lastKnown = { doneToday: false, goalMinutes: null, language: null };

// Replaces the scheduled reminders with ones that match the setting and what
// is known about today. Any argument left out keeps its last known value.
export async function rescheduleStudyReminders(facts = {}) {
  lastKnown = { ...lastKnown, ...facts };
  if (!studyReminderAvailable()) return;
  try {
    const { LocalNotifications } = await plugins();
    const ids = Array.from({ length: DAYS_AHEAD }, (_, i) => ({ id: FIRST_ID + i }));
    await LocalNotifications.cancel({ notifications: ids });

    const setting = await loadReminderSetting();
    const { doneToday, goalMinutes, language } = lastKnown;
    if (!setting.enabled || !goalMinutes) return;

    const { title, body } = reminderText(goalMinutes, language);
    const times = reminderTimes(new Date(), setting.time, doneToday);
    await LocalNotifications.schedule({
      notifications: times.map((at, i) => ({
        id: FIRST_ID + i,
        title,
        body,
        schedule: { at, allowWhileIdle: true },
      })),
    });
  } catch {
    // Best effort: a reminder that does not get scheduled is not worth an error.
  }
}
