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
