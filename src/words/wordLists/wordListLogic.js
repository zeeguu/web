// Pure helpers for the Words pages' lists, shared by the learner's own pages
// and the teacher's view of a student.

export const LEVEL_DESCRIPTIONS = {
  0: "Not yet practiced",
  1: "Recognize (match, multiple choice)",
  2: "Recognize (multiple choice, context, audio)",
  3: "Recall (type translations)",
  4: "Productive recall (spell, fill in blanks)",
};

// { level: [words] } for levels 0-4, each level ordered by frequency rank.
export function groupByLevel(words) {
  const byLevel = { 0: [], 1: [], 2: [], 3: [], 4: [] };
  (words || []).forEach((word) => {
    byLevel[word.level] = [...(byLevel[word.level] || []), word];
  });
  Object.keys(byLevel).forEach((level) => {
    byLevel[level] = byLevel[level].sort((a, b) => a.origin_rank - b.origin_rank);
  });
  return byLevel;
}

// [{ monthKey: "2026-10", words }] most recent month first, words most recent
// first. Words without a valid learned_datetime are left out.
export function groupByMonth(learnedWords) {
  const grouped = {};
  (learnedWords || []).forEach((word) => {
    const learnedDate = word.learned_datetime ? new Date(word.learned_datetime) : null;
    if (!learnedDate || isNaN(learnedDate.getTime())) return;
    const monthKey = `${learnedDate.getFullYear()}-${String(learnedDate.getMonth() + 1).padStart(2, "0")}`;
    (grouped[monthKey] = grouped[monthKey] || []).push(word);
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([monthKey, words]) => ({
      monthKey,
      words: words.sort((a, b) => new Date(b.learned_datetime) - new Date(a.learned_datetime)),
    }));
}

export function calculateMedianRank(words) {
  const ranks = words
    .filter((word) => word.origin_rank && word.origin_rank !== "")
    .map((word) => parseInt(word.origin_rank))
    .sort((a, b) => a - b);
  if (ranks.length === 0) return null;
  const mid = Math.floor(ranks.length / 2);
  return ranks.length % 2 === 0 ? Math.round((ranks[mid - 1] + ranks[mid]) / 2) : ranks[mid];
}

// A learned word whose last exercise was "too easy": the student said they
// knew it, rather than proving it in every level (the old teacher list's
// "self-reported").
const TOO_EASY_OUTCOMES = ["Too easy", "too_easy"];

export function isSelfReported(word) {
  const attempts = word.exercise_attempts || [];
  return attempts.length > 0 && TOO_EASY_OUTCOMES.includes(attempts[attempts.length - 1].outcome);
}
