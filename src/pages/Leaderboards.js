import React, { useMemo } from "react";
import CenteredContainer from "../components/CenteredContainer";
import LeaderboardTable from "../components/LeaderboardTable";

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

function Leaderboards() {
  const leaderboards = useMemo(() => [
    {
      key: "exercises_done",
      tabLabel: "Exercises",
      title: "Exercises Leaderboard",
      metricLabel: "Exercises Done",
      formatMetric: (value) => `${value}`,
      errorMessage: "Could not load exercises leaderboard.",
      emptyMessage: "No exercises leaderboard data available yet.",
    },
    {
      key: "reading_sessions",
      tabLabel: "Reading Sessions",
      title: "Reading Sessions Leaderboard",
      metricLabel: "Sessions",
      formatMetric: (value) => `${formatDuration(value)}`,
      errorMessage: "Could not load reading sessions leaderboard.",
      emptyMessage: "No reading sessions leaderboard data available yet.",
    },
    {
      key: "articles_read",
      tabLabel: "Read Articles",
      title: "Read Articles Leaderboard",
      metricLabel: "Articles Read",
      formatMetric: (value) => `${value}`,
      errorMessage: "Could not load read articles leaderboard.",
      emptyMessage: "No read articles leaderboard data available yet.",
    },
  ], []);

  return (
    <LeaderboardTable leaderboards={leaderboards} />
  );
}

export default Leaderboards;
