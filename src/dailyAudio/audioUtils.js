export function wordsAsTile(words) {
  if (!words || !words.length) return "";

  const comma_separated_words = words.map((word) => word.origin || word).join(", ");
  const capitalized_comma_separated_words =
    comma_separated_words.charAt(0).toUpperCase() + comma_separated_words.slice(1);
  return capitalized_comma_separated_words;
}

export function shortDate() {
  return `[${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}]`;
}

// "Wed, May 27" — shown next to the TODAY label on the episode card so the
// daily lesson reads like a dated episode that renews each day.
export function todayDateLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Compact, human duration for the episode card: "4 min". Rounds up so a
// 30-second clip still reads as "1 min" rather than "0 min".
export function formatDurationMinutes(seconds) {
  if (!seconds || seconds <= 0) return "";
  return `${Math.max(1, Math.round(seconds / 60))} min`;
}
