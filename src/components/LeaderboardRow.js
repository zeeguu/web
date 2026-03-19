import React from "react";

function LeaderboardRow({
  rank,
  name,
  username,
  metrics = [],
  emphasizeTopRanks = 3,
  showUsernameColumn = true,
  highlight = false,
  isDark = false,
}) {
  const usernameText = username ? `@${username}` : "-";
  const highlightStyle = highlight
    ? {
        background: isDark ? "#5f3d00" : "#ffe082",
        boxShadow: `0 0 0 2px ${isDark ? "#ffca28" : "#ffb300"} inset`,
        color: isDark ? "#fff7e0" : "inherit",
      }
    : undefined;

  return (
    <tr style={highlightStyle}>
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
        <td style={{ padding: "0.5em", border: "1px solid #ddd", color: isDark ? "#b5b5b5" : "#666" }}>
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
