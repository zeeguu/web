import React from "react";
import UserBaseInfo from "../components/UserBaseInfo";
import * as s from "./LeaderboardRow.sc";

export default function LeaderboardRow({
  rank,
  user,
  metrics = [],
  emphasizeTopRanks = 3,
  highlight = false,
  isDark = false,
  onViewProfile,
}) {
  return (
    <s.StyledTableRow
      $highlight={highlight}
      $isDark={isDark}
      onClick={() => onViewProfile?.(user.id)} // TODO this does not work currently. After we switch from user IDs to usernames, it will be solved
      $clickable={Boolean(onViewProfile)}
    >
      <s.RankCell $rank={rank} $emphasizeTopRanks={emphasizeTopRanks}>
        {rank}
      </s.RankCell>

      <s.UserDataCell>
        <UserBaseInfo user={user} />
        {highlight && <s.SelfLabel>YOU</s.SelfLabel>}
      </s.UserDataCell>

      {metrics.map((metric) => (
        <s.MetricCell key={metric.key} $textAlign={metric.align} $color={metric.color}>
          {metric.value}
        </s.MetricCell>
      ))}
    </s.StyledTableRow>
  );
}
