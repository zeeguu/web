// What a student's row in the class table says. Pure, so it can be tested.

const DAY_MS = 24 * 60 * 60 * 1000;
export const MIN_EXERCISES_FOR_CORRECTNESS = 10;

// The periods the class table offers, in days (as the API's users_from_cohort
// takes them, and as the student tabs remember them).
export const CLASS_PERIODS = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "182", label: "Last 6 months" },
  { value: "365", label: "Last year" },
];

function parseUtc(value) {
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`);
}

// "today", "yesterday", "5 days ago", "3 months ago", "never".
export function lastActiveText(lastActive, now = new Date()) {
  if (!lastActive) return "never";
  const then = parseUtc(lastActive);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(then)) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months} ${months === 1 ? "month" : "months"} ago` : "over a year ago";
}

// Days since last active; Infinity for never. For "needs attention" sorting.
export function daysInactive(lastActive, now = new Date()) {
  if (!lastActive) return Infinity;
  return (now - parseUtc(lastActive)) / DAY_MS;
}

// Correct on first try, only once there are enough exercises to mean anything.
export function correctText(student) {
  if (!(student.number_of_exercises >= MIN_EXERCISES_FOR_CORRECTNESS)) return "–";
  return `${Math.round(student.correct_on_1st_try * 100)}%`;
}

// "1 h 5 min", "22 min", "45 s", "–" for none. Seconds in.
export function minutesText(seconds) {
  if (!seconds) return "–";
  if (seconds < 60) return `${Math.round(seconds)} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const rest = minutes % 60;
  return rest ? `${Math.floor(minutes / 60)} h ${rest} min` : `${Math.floor(minutes / 60)} h`;
}

// The bar's length: the student's time against the class's most active
// student, never thinner than a visible sliver when there is any time.
export function barWidthPercent(total, classMax) {
  if (!total || !classMax) return 0;
  return Math.max(3, (100 * total) / classMax);
}
