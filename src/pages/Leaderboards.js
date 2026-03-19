import React from "react";
import CenteredContainer from "../components/CenteredContainer";
import LeaderboardTable from "../components/LeaderboardTable";

function Leaderboards() {
  const formatDuration = (durationMs) => {
    const safeMs = Number(durationMs) || 0;
    const totalSeconds = Math.floor(safeMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  };

  return (
    <CenteredContainer>
      <h1>Leaderboards</h1>
      <p>Compare your progress with friends across multiple metrics.</p>

      <LeaderboardTable
        title="Exercise Leaderboard"
        endpointMethod="getExerciseLeaderboard"
        metricLabel="Exercise Time"
        metricKey="session_duration_ms"
        formatMetric={formatDuration}
        errorMessage="Could not load exercise leaderboard."
        emptyMessage="No exercise leaderboard data available yet."
      />

      <LeaderboardTable
        title="Exercises Done Leaderboard"
        endpointMethod="getExercisesDoneLeaderboard"
        metricLabel="Exercises Done"
        metricKey="exercises_done"
        formatMetric={(value) => `${value}`}
        errorMessage="Could not load exercises done leaderboard."
        emptyMessage="No exercises done leaderboard data available yet."
      />

      <LeaderboardTable
        title="Read Articles Leaderboard"
        endpointMethod="getReadArticlesLeaderboard"
        metricLabel="Articles Read"
        metricKey="articles_read"
        formatMetric={(value) => `${value}`}
        errorMessage="Could not load read articles leaderboard."
        emptyMessage="No read articles leaderboard data available yet."
      />

      <LeaderboardTable
        title="Reading Sessions Leaderboard"
        endpointMethod="getReadingSessionsLeaderboard"
        metricLabel="Reading Sessions"
        metricKey="session_count"
        formatMetric={formatDuration}
        errorMessage="Could not load reading sessions leaderboard."
        emptyMessage="No reading sessions leaderboard data available yet."
      />
    </CenteredContainer>
  );
}

export default Leaderboards;
