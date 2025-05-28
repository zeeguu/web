export function countPracticeWeeks(activity) {
  if (!activity || !Array.isArray(activity.reading) || !Array.isArray(activity.exercises)) {
    return 0;
  }
  const practicedWeeks = new Set();
  const allEntries = [...activity.reading, ...activity.exercises];

  allEntries.forEach(({ date, seconds }) => {
    if (seconds > 0) {
      const d = new Date(date);
      const sunday = new Date(d);
      sunday.setDate(d.getDate() - d.getDay());
      practicedWeeks.add(sunday.toISOString().slice(0, 10));
    }
  });

  return practicedWeeks.size;
}