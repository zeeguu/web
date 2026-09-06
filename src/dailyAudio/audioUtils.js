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

// The API serialises `created_at` with isoformat() on a naive UTC timestamp
// (datetime.utcnow), so the string carries no zone designator and JS would read
// it as *local* time — enough to land a late-in-the-UTC-day lesson on the wrong
// calendar day. Append the Z ourselves when it's missing.
export function parseLessonDate(createdAt) {
  if (!createdAt) return null;
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(createdAt);
  const date = new Date(hasZone ? createdAt : `${createdAt}Z`);
  return isNaN(date.getTime()) ? null : date;
}

// "Fri, May 27" — weekday + short date, the episode card's grounding line.
export function formatWeekdayDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Whole calendar days between two moments, in the viewer's own timezone — a
// lesson made at 23:00 is "yesterday" at 07:00 the next morning, eight hours
// later. Rounding absorbs the 23- and 25-hour days at a DST switch.
const startOfLocalDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

function calendarDaysAgo(date, now) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((startOfLocalDay(now) - startOfLocalDay(date)) / MS_PER_DAY);
}

// Past this, "39 days ago" is arithmetic the reader has to do something with
// rather than an age they feel; the date alone says more. A paused lesson can
// sit on the Current tab indefinitely (waiting_paused_for has no cut-off), so
// this branch is reachable, not theoretical.
const RELATIVE_DAYS_LIMIT = 6;

// "Today · Fri, May 27" — shown on the episode card, dated by when the lesson
// was GENERATED, not by when it's being looked at. The Current tab can show an
// older lesson (a paused one waiting to be finished), so the age is measured
// from the lesson: Today, Yesterday, then "4 days ago", then just the date.
export function lessonDateLabel(createdAt) {
  const date = parseLessonDate(createdAt);
  if (!date) return "";

  const formatted = formatWeekdayDate(date);
  const daysAgo = calendarDaysAgo(date, new Date());

  if (daysAgo === 0) return `Today · ${formatted}`;
  if (daysAgo === 1) return `Yesterday · ${formatted}`;
  // Negative = a timestamp in the future (clock skew); claiming "-1 days ago"
  // is worse than showing the bare date.
  if (daysAgo > 1 && daysAgo <= RELATIVE_DAYS_LIMIT) return `${daysAgo} days ago · ${formatted}`;
  return formatted;
}
