import React, { useMemo } from "react";
import CenteredContainer from "../components/CenteredContainer";
import LeaderboardTable from "../components/LeaderboardTable";


function Leaderboards() {
  const leaderboards = useMemo(() => [
    {
      key: "exercises",
      tabLabel: "Exercises",
      title: "Exercises Leaderboard",
      endpointMethod: "getExercisesDoneLeaderboard",
      metricLabel: "Exercises Done",
      metricKey: "exercises_done",
      formatMetric: (value) => `${value}`,
      errorMessage: "Could not load exercises leaderboard.",
      emptyMessage: "No exercises leaderboard data available yet.",
    },
    {
      key: "readingSessions",
      tabLabel: "Reading Sessions",
      title: "Reading Sessions Leaderboard",
      endpointMethod: "getReadingSessionsLeaderboard",
      metricLabel: "Sessions",
      metricKey: "session_count",
      formatMetric: (value) => `${value}`,
      errorMessage: "Could not load reading sessions leaderboard.",
      emptyMessage: "No reading sessions leaderboard data available yet.",
    },
    {
      key: "articles",
      tabLabel: "Read Articles",
      title: "Read Articles Leaderboard",
      endpointMethod: "getReadArticlesLeaderboard",
      metricLabel: "Articles Read",
      metricKey: "articles_read",
      formatMetric: (value) => `${value}`,
      errorMessage: "Could not load read articles leaderboard.",
      emptyMessage: "No read articles leaderboard data available yet.",
    },
  ], []);

  return (
    <CenteredContainer>
      <h1>Leaderboards</h1>
      <p>Compare your progress with friends across multiple metrics.</p>

      <LeaderboardTable leaderboards={leaderboards} />
    </CenteredContainer>
  );
}

export default Leaderboards;
