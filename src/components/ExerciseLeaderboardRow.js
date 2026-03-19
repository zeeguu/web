import React from "react";
import LeaderboardRow from "./LeaderboardRow";

function ExerciseLeaderboardRow({ entry, rank, formatDuration }) {
  const metrics = [
    {
      key: "exercise-time",
      value: formatDuration(entry.session_duration_ms),
      align: "center",
    },
  ];

  return (
    <LeaderboardRow
      rank={rank}
      name={entry.user.name}
      username={entry.user.username}
      metrics={metrics}
    />
  );
}

export default ExerciseLeaderboardRow;
