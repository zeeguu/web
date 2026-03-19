import React from "react";

function LeaderboardRow({
  rank,
  name,
  username,
  metrics = [],
  emphasizeTopRanks = 3,
  showUsernameColumn = true,
  highlight = false,
}) {
  const usernameText = username ? `@${username}` : "-";

  return (
    <tr
      style={
        highlight
          ? {
              background: "#ffe082",
              boxShadow: "0 0 0 2px #ffb300 inset",
            }
          : undefined
      }
    >
      <td
        style={{
          padding: "0.5em",
          border: "1px solid #ddd",
          textAlign: "center",
          fontWeight: rank <= emphasizeTopRanks ? 600 : 400,
        }}
      >
        {rank}
      </td>
      <td style={{ padding: "0.5em", border: "1px solid #ddd" }}>{name}</td>

      {showUsernameColumn && (
        <td style={{ padding: "0.5em", border: "1px solid #ddd", color: "#666" }}>
          {usernameText}
        </td>
      )}

      {metrics.map((metric) => (
        <td
          key={metric.key}
          style={{
            padding: "0.5em",
            border: "1px solid #ddd",
            textAlign: metric.align || "center",
            color: metric.color || "inherit",
          }}
        >
          {metric.value}
        </td>
      ))}
    </tr>
  );
}

export default LeaderboardRow;
