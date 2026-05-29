export function wordsAsTile(words) {
  if (!words || !words.length) return "";

  const comma_separated_words = words.map((word) => word.origin || word).join(", ");
  const capitalized_comma_separated_words =
    comma_separated_words.charAt(0).toUpperCase() + comma_separated_words.slice(1);
  return capitalized_comma_separated_words;
}

// "May 27" — the one short-date format for lessons, shared by the episode card
// header and the past-lessons rows so they can never drift apart.
export function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function shortDate() {
  return `[${formatShortDate(new Date())}]`;
}

// Completion check(s): one ✓ per listen, capped so the row can't grow without
// bound (✓✓✓…✓ beyond 7). Shared by today's episode card and the past-lessons
// list so they show completion the same way.
export function completionChecks(count) {
  if (count <= 7) return "✓".repeat(count);
  return "✓✓✓…✓";
}

// "May 27" for today — shown on the episode card so the daily lesson reads like
// a dated episode (weekday omitted to keep the header compact).
export function todayDateLabel() {
  return formatShortDate(new Date());
}

// Friendly label for the next daily lesson's date (ISO "YYYY-MM-DD", a user-local
// date from the backend): "today" / "tomorrow" / the weekday ("Monday"). Returns
// null when there's no scheduled date (e.g. gated on engagement).
export function formatNextLessonDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / 86400000);
  // Don't promise a past date as "today" — a backend regression returning
  // yesterday would otherwise be masked as a "next lesson today" that never
  // arrives. Let the caller render the no-date fallback instead.
  if (diffDays < 0) return null;
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays < 7) return target.toLocaleDateString("en-US", { weekday: "long" });
  return formatShortDate(target);
}
