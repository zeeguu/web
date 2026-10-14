import { durationLabel } from "../../../words/sessionHistory/sessionCard";
import { tokensCoveredByBookmarks } from "../../../reader/bookmarkRestoration";

export const studentsLabel = (n) => `${n} ${n === 1 ? "student" : "students"}`;

// Under the text's title:
//   "Read by 7 of 12 students · median 6 min (2 min – 15 min) · 23 words looked up"
export function classTextSubtitle({ readers, words, student_count }) {
  const parts = [`Read by ${readers.length} of ${studentsLabel(student_count)}`];
  const time = readingTimeSummary(readers);
  if (time) parts.push(time);
  if (words.length > 0) parts.push(`${words.length} ${words.length === 1 ? "word" : "words"} looked up`);
  return parts.join(" · ");
}

// How long the class spent on the text, over the students who spent any:
// one student's time alone, or the median and the range.
export function readingTimeSummary(readers) {
  const ms = readers
    .map((r) => r.reading_seconds * 1000)
    .filter((each) => each > 0)
    .sort((a, b) => a - b);
  if (ms.length === 0) return null;
  if (ms.length === 1) return durationLabel(ms[0]);
  const middle = Math.floor(ms.length / 2);
  const median = ms.length % 2 ? ms[middle] : (ms[middle - 1] + ms[middle]) / 2;
  return `median ${durationLabel(median)} (${durationLabel(ms[0])} – ${durationLabel(ms[ms.length - 1])})`;
}

// One reader's row: "read 80% · 5 min · 12 words"
export function readerDetails(reader) {
  const parts = [];
  if (reader.reading_completion > 0) parts.push(`read ${Math.round(reader.reading_completion * 100)}%`);
  if (reader.reading_seconds > 0) parts.push(durationLabel(reader.reading_seconds * 1000));
  if (reader.translations > 0) parts.push(`${reader.translations} ${reader.translations === 1 ? "word" : "words"}`);
  return parts.join(" · ") || "opened it";
}

// The heatmap's filter: "looked up by at least N", offering only the
// thresholds some word in the text reaches.
export function thresholdOptions(maxStudents) {
  return [1, 2, 3, 5, 10, 20].filter((n) => n <= maxStudents);
}

// A looked-up token's colour: light green for one student, through yellow, to
// red for the most-looked-up word in this text. Translucent, so it reads on
// the light and the dark theme alike.
export function heatColor(count, maxStudents) {
  const t = maxStudents > 1 ? (count - 1) / (maxStudents - 1) : 0;
  const hue = Math.round(120 * (1 - t));
  const alpha = (0.25 + 0.35 * t).toFixed(2);
  return `hsla(${hue}, 85%, 50%, ${alpha})`;
}

// For one part of the text: "sent_i:token_i" -> [{id, translation}], the
// students who looked that token up. The bookmarks are placed by the reader's
// own restoration, so a word is coloured exactly where the student saw their
// translation. A student counts once per token; their first translation stands.
export function studentsByToken(part) {
  const byToken = new Map();
  const covered = tokensCoveredByBookmarks(part.class_bookmarks, part.tokens || []);
  covered.forEach((tokens, i) => {
    const bookmark = part.class_bookmarks[i];
    for (const token of tokens || []) {
      const key = `${token.sent_i}:${token.token_i}`;
      const students = byToken.get(key) || [];
      if (!students.some((s) => s.id === bookmark.student_id)) {
        students.push({ id: bookmark.student_id, translation: bookmark.translation });
      }
      byToken.set(key, students);
    }
  });
  return byToken;
}
