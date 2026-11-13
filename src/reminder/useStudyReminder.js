import { useEffect, useRef } from "react";
import onAppResume from "../utils/misc/onAppResume";
import { languageName } from "../utils/misc/languageCodeToName";
import {
  dayKey,
  doneTodayFrom,
  logOpenedReminders,
  noteDoneToday,
  rescheduleStudyReminders,
  studyReminderAvailable,
  syncReminderPreferences,
} from "./studyReminder";

// Keeps the scheduled study reminders up to date: when the app starts, when it
// comes back to the foreground (a new day, or study done elsewhere), and when
// the goal or the language changes. LanguageStreakBar reports the moment the
// goal is met while the app is open (noteStreaks). Also keeps the server's
// copy of the setting and of the notification permission current, and logs
// the reminders the learner opens.
export default function useStudyReminder(api, userDetails, userPreferences) {
  const goalMinutes = parseInt(userPreferences?.daily_goal_minutes, 10) || null;
  const learned = userDetails?.learned_language;
  const loggedIn = Boolean(api && learned);

  useEffect(() => {
    if (!loggedIn) return;
    return logOpenedReminders(api);
  }, [api, loggedIn]);

  // The server's copy is compared on start and on each resume, with the
  // preferences as last loaded; what was sent since is remembered by
  // syncReminderPreferences, so it is not sent again.
  const preferences = useRef(userPreferences);
  preferences.current = userPreferences;
  const preferencesLoaded = Boolean(userPreferences?.daily_goal_minutes);
  useEffect(() => {
    if (!loggedIn || !preferencesLoaded) return;
    const sync = () => syncReminderPreferences(api, preferences.current);
    sync();
    return onAppResume(sync);
  }, [api, loggedIn, preferencesLoaded]);

  useEffect(() => {
    if (!studyReminderAvailable() || !api || !learned || !goalMinutes) return;

    let stopped = false;
    function refresh() {
      // Only the latest answer counts: a goal change asks once before the save
      // and once after it, and the answers may come back in either order.
      const request = ++latestRequest;
      api.getAllLanguageStreaks((streaks) => {
        if (stopped || request !== latestRequest) return;
        rescheduleStudyReminders({
          doneOn: doneTodayFrom(streaks) ? dayKey(new Date()) : null,
          goalMinutes,
          language: languageName(learned),
        });
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
  }, [api, learned, goalMinutes]);
}

let refreshNow = null;
let latestRequest = 0;

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
