export const LEADERBOARD_TYPES = [
  {
    key: "reading_time",
    tabLabel: "Reading Time",
    metricLabel: "Time Spent",
    formatMetric: (value) => `${formatDuration(value)}`,
  },
  {
    key: "read_articles",
    tabLabel: "Read Articles",
    metricLabel: "Read Articles",
    formatMetric: (value) => `${value}`,
  },
  {
    key: "exercises_done",
    tabLabel: "Correct Exercises",
    metricLabel: "Exercises Done",
    formatMetric: (value) => `${value}`,
  },
  {
    key: "listening_time",
    tabLabel: "Listening Time",
    metricLabel: "Time Spent",
    formatMetric: (value) => `${formatDuration(value)}`,
  },
];

export const LEADERBOARD_SCOPES = {
  FRIENDS: "friends",
  COHORT: "cohort",
};

function formatDuration(ms) {
  if (!ms || ms <= 0) return "0s";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}
