export function countConsecutivePracticeWeeks(activity) {
  if (!activity || !Array.isArray(activity.reading) || !Array.isArray(activity.exercises)) {
    return 0;
  }

  // Collect all unique week start dates (YYYY-MM-DD, Sunday)
  const practicedWeeks = new Set();
  const allEntries = [...activity.reading, ...activity.exercises];

  allEntries.forEach(({ date, seconds }) => {
    if (seconds > 0) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      // Find the Sunday of this week
      const sunday = new Date(d);
      sunday.setDate(d.getDate() - d.getDay());
      sunday.setHours(0, 0, 0, 0);
      practicedWeeks.add(sunday.toISOString().slice(0, 10));
    }
  });

  if (practicedWeeks.size === 0) return 0;

  // Get this week's Sunday (start of the week)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisSunday = new Date(now);
  thisSunday.setDate(now.getDate() - now.getDay());
  thisSunday.setHours(0, 0, 0, 0);

  // Build streak backwards from this week
  let streak = 0;
  let checkSunday = new Date(thisSunday);

  while (practicedWeeks.has(checkSunday.toISOString().slice(0, 10))) {
    streak++;
    // Go to previous week
    checkSunday.setDate(checkSunday.getDate() - 7);
  }

  return streak;
}