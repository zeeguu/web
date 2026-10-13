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

// A session with nothing to show but its time: one line, not a card.
export function isSlim(session) {
  return session.session_type === "browsing" && !(session.word_count > 0);
}

export function showsBrowsingNote(sessions) {
  return sessions.some((s) => new Date(s.start_time) < new Date(BROWSING_TRACKED_SINCE));
}
