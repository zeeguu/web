import React, { useMemo } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccessAlarmsRoundedIcon from '@mui/icons-material/AccessAlarmsRounded';

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
    tabLabel: "Exercises Done",
    title: "Exercises Leaderboard",
    icon: FitnessCenterRoundedIcon,
    metricLabel: "Exercises Done",
    formatMetric: (value) => `${value}`,
    errorMessage: "Could not load exercises leaderboard.",
    emptyMessage: "No exercises leaderboard data available yet.",
  },
  {
    key: "reading_time",
    tabLabel: "Reading Time",
    title: "Reading Time Leaderboard",
    icon: AccessAlarmsRoundedIcon,
    metricLabel: "Time Spent",
    formatMetric: (value) => `${formatDuration(value)}`,
    errorMessage: "Could not load reading time leaderboard.",
    emptyMessage: "No reading time leaderboard data available yet.",
  },
  {
    key: "listening_time",
    tabLabel: "Listening Time",
    title: "Listening Time Leaderboard",
    icon: AccessAlarmsRoundedIcon,
    metricLabel: "Time Spent",
    formatMetric: (value) => `${formatDuration(value)}`,
    errorMessage: "Could not load listening time leaderboard.",
    emptyMessage: "No listening time leaderboard data available yet.",
  },
  {
    key: "exercise_time",
    tabLabel: "Exercise Time",
    title: "Exercise Time Leaderboard",
    icon: AccessAlarmsRoundedIcon,
    metricLabel: "Time Spent",
    formatMetric: (value) => `${formatDuration(value)}`,
    errorMessage: "Could not load exercise time leaderboard.",
    emptyMessage: "No exercise time leaderboard data available yet.",
  },
  {
    key: "read_articles",
    tabLabel: "Read Articles",
    title: "Read Articles Leaderboard",
    icon: MenuBookRoundedIcon,
    metricLabel: "Read Articles",
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
