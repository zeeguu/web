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
