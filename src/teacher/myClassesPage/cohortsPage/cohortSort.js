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
