import { useEffect } from "react";
import onAppResume from "../utils/misc/onAppResume";
import { languageName } from "../utils/misc/languageCodeToName";
import { doneTodayFrom, rescheduleStudyReminders, studyReminderAvailable } from "./studyReminder";

// Keeps the scheduled study reminders up to date: when the app starts, when it
// comes back to the foreground (a new day, or study done elsewhere), and when
// the goal or the language changes. LanguageStreakBar reports the moment the
// goal is met while the app is open (noteStreaks).
export default function useStudyReminder(api, userDetails, userPreferences) {
  const goalMinutes = parseInt(userPreferences?.daily_goal_minutes, 10) || null;
  const learned = userDetails?.learned_language;

  useEffect(() => {
    if (!studyReminderAvailable() || !api || !learned || !goalMinutes) return;

    function refresh() {
      api.getAllLanguageStreaks((streaks) => {
        knownDone = doneTodayFrom(streaks);
        rescheduleStudyReminders({ doneToday: knownDone, goalMinutes, language: languageName(learned) });
      });
    }

    refresh();
    return onAppResume(refresh);
  }, [api, learned, goalMinutes]);
}

let knownDone = false;

// Called with each /all_language_streaks answer the app gets anyway (it polls
// while the goal is not met); reschedules only when today has just become done.
export function noteStreaks(streaks) {
  if (knownDone || !doneTodayFrom(streaks)) return;
  knownDone = true;
  rescheduleStudyReminders({ doneToday: true });
}
