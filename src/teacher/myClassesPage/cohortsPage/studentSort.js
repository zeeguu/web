import { classListOrder } from "./duplicateStudents";
import { daysInactive, MIN_EXERCISES_FOR_CORRECTNESS } from "./studentRowText";

// The class table sorts by its column headers. A first click sorts the way a
// teacher usually wants (`first`); a second click reverses. The choice is the
// teacher's, kept across classes (see StudentsActivityOverviewContent).
export const SORT_COLUMNS = {
  name: { first: "asc" },
  last_active: { first: "desc" }, // longest inactive first: who needs attention
  time: { first: "desc" },
  texts: { first: "desc" },
  exercises: { first: "desc" },
  correct: { first: "desc" },
};

export const DEFAULT_STUDENT_SORT = { key: "name", dir: "asc" };

const byName = (a, b) => (a.name || "").localeCompare(b.name || "");

// A comparable value per column, larger = more (activity, recency of absence…).
const VALUE = {
  last_active: (s) => daysInactive(s.last_active),
  time: (s) => s.total_time || 0,
  texts: (s) => s.number_of_texts || 0,
  exercises: (s) => s.number_of_exercises || 0,
  correct: (s) => s.correct_on_1st_try || 0,
};

// Clicking a header: the same column reverses, another starts at its `first`.
export function nextSort(current, key) {
  if (current?.key === key) return { key, dir: current.dir === "asc" ? "desc" : "asc" };
  return { key, dir: SORT_COLUMNS[key]?.first || "asc" };
}

// students as transformStudents leaves them (total_time: seconds in the
// period, all kinds of activity).
export function sortStudents(students, sort) {
  const { key, dir } = SORT_COLUMNS[sort?.key] ? sort : DEFAULT_STUDENT_SORT;
  if (key === "name") {
    // likely duplicates stay side by side
    const ordered = classListOrder(students);
    return dir === "asc" ? ordered : ordered.reverse();
  }
  const sign = dir === "asc" ? 1 : -1;
  const value = VALUE[key];
  // too few exercises for correctness to mean anything: always at the bottom
  const unknown = (s) => key === "correct" && !(s.number_of_exercises >= MIN_EXERCISES_FOR_CORRECTNESS);
  return [...students].sort((a, b) => {
    if (unknown(a) !== unknown(b)) return unknown(a) ? 1 : -1;
    if (unknown(a)) return byName(a, b);
    const va = value(a);
    const vb = value(b);
    if (va === vb) return byName(a, b);
    return va > vb ? sign : -sign;
  });
}

export function matchesSearch(student, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  return `${student.name || ""} ${student.email || ""}`.toLowerCase().includes(q);
}
