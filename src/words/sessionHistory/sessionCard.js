// What a session's row says, in the order a teacher (or the learner) reads it:
// what it was, how long, then the details. Pure, so it can be tested.
import { formatTime } from "./sessionStats";

// Browsing has been recorded since this day; before it, its absence means nothing.
export const BROWSING_TRACKED_SINCE = "2025-12-11";

export function sessionTitle(session) {
  switch (session.session_type) {
    case "reading":
      return session.article_title || "Reading";
    case "audio":
      return session.lesson_title || "Audio lesson";
    case "exercise":
      return "Exercises";
    default:
      return "Browsed the article list";
  }
}

// "45 s", "6 min", "1 h 5 min": a duration at a glance.
export function durationLabel(ms) {
  const seconds = Math.round((ms || 0) / 1000);
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const rest = minutes % 60;
  return rest ? `${Math.floor(minutes / 60)} h ${rest} min` : `${Math.floor(minutes / 60)} h`;
}

const lookedUp = (n) => (n > 0 ? `${n} ${n === 1 ? "word" : "words"} looked up` : null);

// The muted line under the title.
export function sessionDetails(session) {
  const details = [formatTime(session.start_time)];
  switch (session.session_type) {
    case "reading":
      if (session.article_word_count > 0) details.push(`${session.article_word_count} words`);
      if (session.article_cefr_level) details.push(session.article_cefr_level);
      if (session.reading_completion > 0) details.push(`read ${Math.round(session.reading_completion * 100)}%`);
      details.push(lookedUp(session.word_count));
      break;
    case "exercise":
      details.push(`${session.word_count} ${session.word_count === 1 ? "word" : "words"}`);
      details.push(`${session.accuracy}% correct`);
      break;
    case "audio":
      details.push(session.completed ? `${session.word_count} words` : "not finished");
      break;
    default:
      details.push(lookedUp(session.word_count));
  }
  return details.filter(Boolean);
}

// How many of the words looked up in a session were practised in exercises
// afterwards. An exercise session's words are the practice itself: 0.
export function practisedCount(session) {
  if (session.session_type === "exercise") return 0;
  return (session.words || []).filter((word) => word.practised).length;
}

// A session with nothing to show but its time: one line, not a card.
export function isSlim(session) {
  return session.session_type === "browsing" && !(session.word_count > 0);
}

export function showsBrowsingNote(sessions) {
  return sessions.some((s) => new Date(s.start_time) < new Date(BROWSING_TRACKED_SINCE));
}

// An exercise session's words, each once, with its results in order, split
// into the ones that needed help (any wrong answer) and the ones right every
// time. A word practised twice used to show twice: "chaque ✓ … chaque ✗".
export function groupExerciseWords(words) {
  const byWord = new Map();
  (words || []).forEach((word) => {
    const key = `${word.origin}\u0000${word.translation}`;
    if (!byWord.has(key)) byWord.set(key, { ...word, results: [] });
    byWord.get(key).results.push(!!word.correct);
  });
  const all = [...byWord.values()];
  return {
    neededHelp: all.filter((w) => w.results.includes(false)),
    right: all.filter((w) => !w.results.includes(false)),
  };
}

// What used to say "Distracted": the fact behind it. Shown when the API judges
// the session distracted (several departures, often): "left the page 9×".
export function leftThePage(session) {
  if (session.focus_level !== "distracted" || !(session.interruptions > 0)) return null;
  return `left the page ${session.interruptions}×`;
}

// A browsing session's words under the article whose title or summary they
// were translated in, articles in the order first translated in. Words with
// no article (older sessions, search) form a group with no title.
export function groupBrowsingWords(words) {
  const byArticle = new Map();
  (words || []).forEach((word) => {
    const key = word.article_id ?? null;
    if (!byArticle.has(key)) byArticle.set(key, { articleId: key, title: word.article_title ?? null, words: [] });
    byArticle.get(key).words.push(word);
  });
  return [...byArticle.values()];
}
