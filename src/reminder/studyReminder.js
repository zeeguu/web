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
// notifications it schedules do too. The server gets a copy, with whether the
// phone allows notifications, so it can tell which days a reminder would have
// fired; the app logs STUDY_REMINDER_OPENED when the learner opens one. iOS
// shows a scheduled notification without running the app, so whether one was
// shown is not known, only whether it was opened.

export const DEFAULT_REMINDER_TIME = "19:00";
const DAYS_AHEAD = 7;
const FIRST_ID = 4600; // ids FIRST_ID .. FIRST_ID + DAYS_AHEAD - 1 are ours
const SETTING_KEY = "study_reminder";
const TEST_ID = FIRST_ID + 99;

// Which text a reminder used, logged when it is opened, so texts can later be
// compared (and rotated: a repeated text loses its effect).
export const REMINDER_TEXT_ID = "goal-v1";
export const REMINDER_OPENED_EVENT = "STUDY_REMINDER_OPENED";

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
    id: REMINDER_TEXT_ID,
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

// The preferences to send the server so its copy matches this phone: only the
// ones that differ from what it has. `permission` is the OS answer
// (LocalNotifications.checkPermissions().display).
export function reminderPreferencesToSync(setting, permission, serverPreferences = {}) {
  const wanted = {
    study_reminder_enabled: setting.enabled ? "true" : "false",
    study_reminder_time: setting.time,
    notifications_permission: permission === "prompt-with-rationale" ? "prompt" : permission,
  };
  return Object.fromEntries(Object.entries(wanted).filter(([key, value]) => value && serverPreferences[key] !== value));
}

// Sends the server the setting and permission when they differ from its copy.
// Resolves to the preferences sent.
export async function syncReminderPreferences(api, serverPreferences) {
  if (!studyReminderAvailable()) return {};
  try {
    const { LocalNotifications } = await plugins();
    const [setting, { display }] = await Promise.all([loadReminderSetting(), LocalNotifications.checkPermissions()]);
    const changed = reminderPreferencesToSync(setting, display, serverPreferences);
    if (Object.keys(changed).length) api.saveUserPreferences(changed);
    return changed;
  } catch {
    return {};
  }
}

// What to log when the learner opens a notification: one of ours, or null.
export function openedReminderEvent(notification) {
  const extra = notification?.extra;
  if (extra?.kind !== "study_reminder") return null;
  return {
    textId: extra.textId,
    details: JSON.stringify({ scheduled_for: extra.scheduledFor, test: Boolean(extra.test) }),
  };
}

// Logs each opened reminder. iOS keeps the event of a tap that launched the
// app until a listener is added, so this also catches those. Returns a cleanup.
export function logOpenedReminders(api) {
  if (!studyReminderAvailable()) return () => {};
  let handle = null;
  let removed = false;
  plugins()
    .then(({ LocalNotifications }) =>
      LocalNotifications.addListener("localNotificationActionPerformed", ({ notification }) => {
        const event = openedReminderEvent(notification);
        if (event) api.logUserActivity(REMINDER_OPENED_EVENT, "", event.textId, event.details);
      }),
    )
    .then((h) => {
      handle = h;
      if (removed) h.remove();
    })
    .catch(() => {});
  return () => {
    removed = true;
    handle?.remove();
  };
}

function reminderExtra(textId, at, test = false) {
  return { kind: "study_reminder", textId, scheduledFor: at.toISOString(), test };
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

    const { id: textId, title, body } = reminderText(goalMinutes, language);
    const times = reminderTimes(new Date(), setting.time, doneToday);
    await LocalNotifications.schedule({
      notifications: times.map((at, i) => ({
        id: FIRST_ID + i,
        title,
        body,
        schedule: { at, allowWhileIdle: true },
        extra: reminderExtra(textId, at),
      })),
    });
  } catch {
    // Best effort: a reminder that does not get scheduled is not worth an error.
  }
}

// Developer tools: the reminder's real text, once, a minute from now, whatever
// the setting and today's progress. Resolves to false without permission.
export async function sendTestReminder(goalMinutes, language) {
  if (!(await allowReminders())) return false;
  const { LocalNotifications } = await plugins();
  const { id: textId, title, body } = reminderText(goalMinutes, language);
  const at = new Date(Date.now() + 60_000);
  await LocalNotifications.schedule({
    notifications: [{ id: TEST_ID, title, body, schedule: { at }, extra: reminderExtra(textId, at, true) }],
  });
  return true;
}
