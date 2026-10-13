// Students who are probably one person with two accounts in the same class:
// the same name, or the same email before the "@" (a student number at the
// school's domain and at another one, as at Cygnus Gymnasium in Oct 2026).
// A teacher looking at the empty one of the pair saw a student who "did
// nothing". The cleanup is the account-merge tool (tools/merge_users.py).

const normalizedName = (student) => (student.name || "").trim().toLowerCase().replace(/\s+/g, " ");
const localPart = (student) => (student.email || "").split("@")[0].trim().toLowerCase();

// { studentId: [the other students it likely duplicates] }
export function likelyDuplicates(students) {
  const result = {};
  for (const a of students) {
    const others = students.filter(
      (b) =>
        b.id !== a.id &&
        ((normalizedName(a) && normalizedName(a) === normalizedName(b)) ||
          (localPart(a) && localPart(a) === localPart(b))),
    );
    if (others.length > 0) result[a.id] = others;
  }
  return result;
}

// The class list's order: by name, with each likely duplicate right after the
// first account of its group, so a teacher sees the pair side by side even
// when the two names differ (same email before the @).
export function classListOrder(students, duplicates = likelyDuplicates(students)) {
  const byName = [...students].sort(
    (a, b) => normalizedName(a).localeCompare(normalizedName(b)) || (a.id ?? 0) - (b.id ?? 0),
  );
  const placed = new Set();
  const ordered = [];
  for (const student of byName) {
    if (placed.has(student.id)) continue;
    ordered.push(student);
    placed.add(student.id);
    for (const other of byName) {
      if (!placed.has(other.id) && (duplicates[student.id] || []).some((d) => d.id === other.id)) {
        ordered.push(other);
        placed.add(other.id);
      }
    }
  }
  return ordered;
}
