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
