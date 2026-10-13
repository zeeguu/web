import { classListOrder } from "./duplicateStudents";

// How a class's students can be ordered. The choice is the teacher's, kept
// across classes (see StudentsActivityOverviewContent).
export const STUDENT_SORTS = [
  { value: "name", label: "Name A–Z" },
  { value: "least_active", label: "Least active first" },
  { value: "most_active", label: "Most active first" },
];

export const DEFAULT_STUDENT_SORT = "name";

const byName = (a, b) => (a.name || "").localeCompare(b.name || "");

// students as transformStudents leaves them (total_time: seconds in the
// period, all kinds of activity).
export function sortStudents(students, sort) {
  if (sort === "least_active") return [...students].sort((a, b) => a.total_time - b.total_time || byName(a, b));
  if (sort === "most_active") return [...students].sort((a, b) => b.total_time - a.total_time || byName(a, b));
  // by name, likely duplicates side by side
  return classListOrder(students);
}

export function matchesSearch(student, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  return `${student.name || ""} ${student.email || ""}`.toLowerCase().includes(q);
}
