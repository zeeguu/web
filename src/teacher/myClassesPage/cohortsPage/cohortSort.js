// How the class list can be ordered. Some teachers have ~100 classes, most of
// them long dormant, so the default puts the ones in use on top.

export const COHORT_SORTS = [
  { value: "active", label: "Recently active" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A–Z" },
];

export const DEFAULT_COHORT_SORT = "active";

// Class ids grow with creation; there is no creation date stored.
const newestFirst = (a, b) => b.id - a.id;

function lastActivity(cohort) {
  return cohort.last_activity ? Date.parse(cohort.last_activity) : 0;
}

const COMPARATORS = {
  // last_activity: a student seen or a text shared (cohorts_info). Classes
  // with neither go last, newest first among them.
  active: (a, b) => lastActivity(b) - lastActivity(a) || newestFirst(a, b),
  newest: newestFirst,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function sortCohorts(cohorts, sort) {
  const compare = COMPARATORS[sort] || COMPARATORS[DEFAULT_COHORT_SORT];
  return [...cohorts].sort(compare);
}

const DAY_MS = 24 * 60 * 60 * 1000;

// "Active today", "Active 3 days ago"… for a class's last_activity. Days, not
// hours: the practice part of it is only stored once a day (the first time).
// UTC; read as such even if a zone marker is missing.
export function lastActivityLabel(lastActivity, now = new Date()) {
  if (!lastActivity) return "No activity yet";
  const iso = /[zZ]|[+-]\d\d:\d\d$/.test(lastActivity) ? lastActivity : `${lastActivity}Z`;
  const then = new Date(iso);
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(then)) / DAY_MS);
  if (days <= 0) return "Active today";
  if (days === 1) return "Active yesterday";
  if (days < 30) return `Active ${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `Active ${months} ${months === 1 ? "month" : "months"} ago`;
  const years = Math.round(days / 365);
  return `Active ${years} ${years === 1 ? "year" : "years"} ago`;
}
