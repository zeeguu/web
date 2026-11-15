// Study time in a day that keeps the streak is the learner's daily goal
// (ADR 046). /all_language_streaks sends ms_to_streak, the part of it still to
// study today; the goal itself comes with the preferences, always present, as a
// string. The API's default, for when the preferences have not loaded yet.
export const DEFAULT_DAILY_GOAL_MINUTES = 5;

// A language counts down until today counts. The API sends ms_to_streak only
// for the language being learned now (null for the others; older APIs send
// none), so this is also false for every other language.
export function isCountingDown(practicedToday, msToStreak) {
  return !practicedToday && typeof msToStreak === "number";
}

// How far today's study is toward the daily goal, 0 to 100.
export function studiedPercent(msToStreak, goalMinutes) {
  const goalMs = (Number(goalMinutes) || DEFAULT_DAILY_GOAL_MINUTES) * 60_000;
  const studied = goalMs - msToStreak;
  return Math.min(100, Math.max(0, (studied / goalMs) * 100));
}

export function streakCountdownHint(msToStreak, dailyStreak) {
  const minutes = Math.max(1, Math.ceil(msToStreak / 60_000));
  const study = `${minutes} more minute${minutes === 1 ? "" : "s"} of study today`;
  const goal = dailyStreak >= 1 ? "keeps your streak" : "starts a streak";
  return `${study} ${goal}`;
}
