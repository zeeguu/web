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

// "2026-11-13": the local day, to tell whether "done" is about today.
export function dayKey(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

const REMINDER_OFF = { enabled: false, time: DEFAULT_REMINDER_TIME };

export async function loadReminderSetting() {
  return (await loadStoredSetting()) || REMINDER_OFF;
}

// The setting this phone keeps; null when it has none (a new install, or after
// logging out).
async function loadStoredSetting() {
  if (!studyReminderAvailable()) return null;
  try {
    const { Preferences } = await plugins();
    const { value } = await Preferences.get({ key: SETTING_KEY });
    return value ? { ...REMINDER_OFF, ...JSON.parse(value) } : null;
  } catch {
    return null;
  }
}

// The setting as the server keeps it, for a phone that has none of its own:
// the learner's choice survives logging out, a reinstall or a new phone. Null
// when there is nothing safe to keep: no setting on the server, or a reminder
// that is on while this phone may not show notifications yet (keeping it as
// "off" would then overwrite the learner's choice on the server).
export function settingFromServer(serverPreferences, permission) {
  const enabled = serverPreferences?.study_reminder_enabled;
  const time = serverPreferences?.study_reminder_time || DEFAULT_REMINDER_TIME;
  if (enabled === "false") return { enabled: false, time };
  if (enabled === "true" && permission === "granted") return { enabled: true, time };
  return null;
}

// The preferences to send the server so its copy matches this phone: only the
// ones that differ from what it has. `permission` is the OS answer
// (LocalNotifications.checkPermissions().display). A phone with no setting of
// its own (`setting` null) reports only the permission: it has no choice to tell.
export function reminderPreferencesToSync(setting, permission, serverPreferences = {}) {
  // What this app sent since start counts as the server's copy too.
  serverPreferences = { ...serverPreferences, ...sentToServer };
  const wanted = {
    notifications_permission: permission === "prompt-with-rationale" ? "prompt" : permission,
  };
  if (setting) {
    wanted.study_reminder_enabled = setting.enabled ? "true" : "false";
    wanted.study_reminder_time = setting.time;
  }
  return Object.fromEntries(Object.entries(wanted).filter(([key, value]) => value && serverPreferences[key] !== value));
}

let sentToServer = {};

// Bumped on logout: anything still on its way for the learner who logged out
// (a restore, a save's answer) sees it and does nothing.
let session = 0;

// The latest sync, so the settings page shows the setting once a restore from
// the server has landed rather than "off" just before it.
let syncing = Promise.resolve();

export function reminderSettingReady() {
  return syncing.then(() => rescheduling);
}

// Sends the server the setting and permission when they differ from its copy;
// first, on a phone without a setting, takes the server's. Resolves to the
// preferences sent.
export function syncReminderPreferences(api, serverPreferences) {
  syncing = sync(api, serverPreferences);
  return syncing;
}

async function sync(api, serverPreferences) {
  if (!studyReminderAvailable()) return {};
  const mySession = session;
  try {
    const { LocalNotifications } = await plugins();
    const [stored, { display }] = await Promise.all([loadStoredSetting(), LocalNotifications.checkPermissions()]);
    if (mySession !== session) return {};
    let setting = stored;
    const restored = !stored && settingFromServer(serverPreferences, display);
    if (restored) {
      setting = restored;
      // In the queue, after any logout's clear that came first.
      rescheduling = rescheduling.then(async () => {
        if (mySession !== session || (await loadStoredSetting())) return;
        await saveReminderSetting(restored);
      });
      rescheduleStudyReminders();
    }
    const changed = reminderPreferencesToSync(setting, display, serverPreferences);
    if (Object.keys(changed).length) {
      api.saveUserPreferences(changed, () => {
        if (mySession === session) Object.assign(sentToServer, changed);
      });
    }
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
// reschedule without asking the API again. `doneOn` is the day (dayKey) the
// goal was last known to be met, so "done" expires at midnight by itself.
const nothingKnown = { doneOn: null, goalMinutes: null, language: null };
let lastKnown = { ...nothingKnown };

// Reschedules one at a time: each reads the setting and the facts when it
// runs, so the last change wins even if an earlier one was still running.
let rescheduling = Promise.resolve();

// Replaces the scheduled reminders with ones that match the setting and what
// is known about today. Any fact left out keeps its last known value.
export function rescheduleStudyReminders(facts = {}) {
  lastKnown = { ...lastKnown, ...facts };
  rescheduling = rescheduling.then(reschedule);
  return rescheduling;
}

// The goal was just met today (LanguageStreakBar saw it): today's reminder goes.
export function noteDoneToday() {
  const today = dayKey(new Date());
  if (lastKnown.doneOn !== today) rescheduleStudyReminders({ doneOn: today });
}

// On logout: this phone stops reminding, and forgets the setting, so the next
// learner to log in on it starts with the reminder off.
// In the reschedule queue, so one still running cannot schedule them again.
export function clearStudyReminders() {
  session++;
  lastKnown = { ...nothingKnown };
  sentToServer = {};
  rescheduling = rescheduling.then(clear);
  return rescheduling;
}

async function clear() {
  if (!studyReminderAvailable()) return;
  try {
    const { LocalNotifications, Preferences } = await plugins();
    await LocalNotifications.cancel({ notifications: ourIds().map((id) => ({ id })) });
    await Preferences.remove({ key: SETTING_KEY });
  } catch {
    // Nothing scheduled, or an older app build: nothing to clear.
  }
}

function ourIds() {
  return [...Array.from({ length: DAYS_AHEAD }, (_, i) => FIRST_ID + i), TEST_ID];
}

async function reschedule() {
  if (!studyReminderAvailable()) return;
  try {
    const { LocalNotifications } = await plugins();
    const ids = Array.from({ length: DAYS_AHEAD }, (_, i) => ({ id: FIRST_ID + i }));
    await LocalNotifications.cancel({ notifications: ids });

    const setting = await loadReminderSetting();
    const { doneOn, goalMinutes, language } = lastKnown;
    if (!setting.enabled || !goalMinutes) return;

    const now = new Date();
    const { id: textId, title, body } = reminderText(goalMinutes, language);
    const times = reminderTimes(now, setting.time, doneOn === dayKey(now));
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
