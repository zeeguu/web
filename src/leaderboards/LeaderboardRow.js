import React from "react";
import UserBaseInfo from "../components/UserBaseInfo";
import * as s from "./LeaderboardRow.sc";

export default function LeaderboardRow({
  rank,
  user,
  metrics = [],
  emphasizeTopRanks = 3,
  highlight = false,
  onViewProfile,
}) {
  return (
    <s.StyledTableRow
      $highlight={highlight}
      onClick={() => onViewProfile?.(user.username)}
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
