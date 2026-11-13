import { useEffect, useRef } from "react";
import onAppResume from "../utils/misc/onAppResume";
import { languageName } from "../utils/misc/languageCodeToName";
import {
  dayKey,
  doneTodayFrom,
  logOpenedReminders,
  noteDoneToday,
  notificationPermission,
  reminderSettingFrom,
  rescheduleStudyReminders,
  studyReminderAvailable,
} from "./studyReminder";

// Keeps the phone's scheduled study reminders in line with the learner's
// preferences (the setting and the daily goal) and with today's progress: when
// the app starts, when it comes back to the foreground (a new day, or study
// done elsewhere), and when the preferences change. LanguageStreakBar reports
// the moment the goal is met while the app is open (noteStreaks). Also reports
// whether the phone may show notifications, and logs the reminders opened.
export default function useStudyReminder(api, userDetails, userPreferences) {
  const goalMinutes = parseInt(userPreferences?.daily_goal_minutes, 10) || null;
  const learned = userDetails?.learned_language;
  const loggedIn = Boolean(api && learned);
  const { enabled, time } = reminderSettingFrom(userPreferences);

  useEffect(() => {
    if (!loggedIn) return;
    return logOpenedReminders(api);
  }, [api, loggedIn]);

  // Whether the phone may show notifications, checked on start and on resume
  // (it can be changed in the phone's settings at any time), and reported
  // when it differs from what the server last heard.
  const preferences = useRef(userPreferences);
  preferences.current = userPreferences;
  const preferencesLoaded = Boolean(userPreferences?.daily_goal_minutes);
  useEffect(() => {
    if (!loggedIn || !preferencesLoaded || !studyReminderAvailable()) return;
    let stopped = false;
    let reported = preferences.current?.notifications_permission;
    async function report() {
      const permission = await notificationPermission();
      if (stopped || !permission || permission === reported) return;
      // Remembered once saved: a failed save is tried again on the next resume.
      api.saveUserPreferences({ notifications_permission: permission }, () => (reported = permission));
    }
    report();
    const stopListening = onAppResume(report);
    return () => {
      stopped = true;
      stopListening();
    };
  }, [api, loggedIn, preferencesLoaded]);

  // The setting and the goal take effect at once.
  const language = languageName(learned);
  useEffect(() => {
    if (!studyReminderAvailable() || !learned || !goalMinutes) return;
    rescheduleStudyReminders({ enabled, time, goalMinutes, language });
  }, [learned, goalMinutes, enabled, time, language]);

  // Today's progress: on start, on resume, and when the goal changes (the
  // server may count today against the new goal) or the reminder is turned on.
  useEffect(() => {
    if (!studyReminderAvailable() || !api || !learned || !goalMinutes || !enabled) return;

    let stopped = false;
    function refresh() {
      // A goal change asks once before the save and once after it, and the
      // answers may come back in either order: an older answer never replaces
      // a newer one (but is used if the newer one never comes).
      const request = ++requestsSent;
      api.getAllLanguageStreaks((streaks) => {
        if (stopped || request < newestAnswer) return;
        newestAnswer = request;
        rescheduleStudyReminders({ doneOn: doneTodayFrom(streaks) ? dayKey(new Date()) : null });
      });
    }

    refreshNow = refresh;
    refresh();
    const stopListening = onAppResume(refresh);
    return () => {
      stopped = true; // e.g. logged out: an answer still on its way is ignored
      refreshNow = null;
      stopListening();
    };
  }, [api, learned, goalMinutes, enabled]);
}

let refreshNow = null;
let requestsSent = 0;
let newestAnswer = 0;

// Asks the API again whether today is done, e.g. once a new goal is saved
// (the server may have just counted today against it).
export function refreshStudyReminders() {
  refreshNow?.();
}

// Called with each /all_language_streaks answer the app gets anyway (it polls
// while the goal is not met), so a goal met while the app is open removes
// today's reminder at once.
export function noteStreaks(streaks) {
  if (doneTodayFrom(streaks)) noteDoneToday();
}
