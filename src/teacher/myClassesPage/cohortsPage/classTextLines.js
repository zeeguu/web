import { durationLabel } from "../../../words/sessionHistory/sessionCard";

export const studentsLabel = (n) => `${n} ${n === 1 ? "student" : "students"}`;

// Under the text's title: "Read by 7 of 12 students · 23 words looked up"
export function classTextSubtitle({ readers, words, student_count }) {
  const parts = [`Read by ${readers.length} of ${studentsLabel(student_count)}`];
  if (words.length > 0) parts.push(`${words.length} ${words.length === 1 ? "word" : "words"} looked up`);
  return parts.join(" · ");
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

// "sent_i:token_i" -> [student ids], for one part of the text.
export function lookupsByToken(lookups) {
  return new Map((lookups || []).map((l) => [`${l.sent_i}:${l.token_i}`, l.students]));
}
