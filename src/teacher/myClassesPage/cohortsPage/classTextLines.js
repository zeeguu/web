import { durationLabel } from "../../../words/sessionHistory/sessionCard";
import { tokensCoveredByBookmarks } from "../../../reader/bookmarkRestoration";

export const studentsLabel = (n) => `${n} ${n === 1 ? "student" : "students"}`;

// The three pieces of the line under the text's title, so the page can make
// the time hoverable: { readers, time, words }, time and words null when empty.
//   "Read by 7 of 12 students" · "median 6 min (2 min – 15 min)" · "23 words looked up"
export function classTextSubtitle({ readers, words, student_count }) {
  return {
    readers: `Read by ${readers.length} of ${studentsLabel(student_count)}`,
    time: readingTimeSummary(readers),
    words: words.length > 0 ? `${words.length} ${words.length === 1 ? "word" : "words"} looked up` : null,
  };
}

// For the reading-time chart: the students who spent any time, longest first.
export function readingTimes(readers) {
  return readers
    .filter((r) => r.reading_seconds > 0)
    .map((r) => ({ id: r.id, name: r.name, ms: r.reading_seconds * 1000 }))
    .sort((a, b) => b.ms - a.ms);
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

// For one part of the text: "sent_i:token_i" -> { students, covers }.
// students: [{id, translation}], who looked that token up, once each, their
// first translation standing. covers: which lookups cover the token, so that
// neighbours covered by the same ones ("chow down") draw as one box.
// The bookmarks are placed by the reader's own restoration, so a word is
// coloured exactly where the student saw their translation.
export function lookupsByToken(part) {
  const byToken = new Map();
  const covered = tokensCoveredByBookmarks(part.class_bookmarks, part.tokens || []);
  covered.forEach((tokens, i) => {
    const bookmark = part.class_bookmarks[i];
    for (const token of tokens || []) {
      const key = `${token.sent_i}:${token.token_i}`;
      const lookup = byToken.get(key) || { students: [], covers: [] };
      if (!lookup.students.some((s) => s.id === bookmark.student_id)) {
        lookup.students.push({ id: bookmark.student_id, translation: bookmark.translation });
      }
      lookup.covers.push(i);
      byToken.set(key, lookup);
    }
  });
  return byToken;
}

// A paragraph's tokens cut into runs to draw: [{ tokens, lookup }], lookup
// null for plain text. Consecutive tokens of one sentence covered by exactly
// the same lookups make one run, so a phrase is one coloured box. Tokens
// looked up by fewer than `threshold` students are plain.
export function heatRuns(tokens, byToken, threshold) {
  const runs = [];
  for (const token of tokens) {
    const found = byToken.get(`${token.sent_i}:${token.token_i}`);
    const lookup = found && found.students.length >= threshold ? found : null;
    const last = runs[runs.length - 1];
    const sameRun =
      last &&
      (lookup === null
        ? last.lookup === null
        : last.lookup !== null &&
          last.tokens[last.tokens.length - 1].sent_i === token.sent_i &&
          last.lookup.covers.join() === lookup.covers.join());
    if (sameRun) last.tokens.push(token);
    else runs.push({ tokens: [token], lookup });
  }
  return runs;
}

// A run's text, spaced as in the original, and whether a space follows it.
export function runText(tokens) {
  const text = tokens.map((t, i) => t.text + (i < tokens.length - 1 && t.has_space ? " " : "")).join("");
  return { text, spaceAfter: !!tokens[tokens.length - 1].has_space };
}
