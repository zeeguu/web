import React from "react";
import { zeeguuOrange } from "@/components/colors";

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
        background: "rgba(255, 187, 84, 0.2)",
        color: isDark ? "#fff7e0" : "inherit",
      }
    : undefined;

  return (
    <tr style={highlightStyle}>
      <td
        style={{
          padding: "1em",
          borderBottom: "1px solid #ddd",
          textAlign: "center",
          fontWeight: rank <= emphasizeTopRanks ? 600 : 400,
        }}
      >
        {rank}
      </td>
      <td style={{ padding: "0.5em", borderBottom: "1px solid #ddd" }}>
        {name}{" "}
        {highlight && (
          <span
            style={{
              fontSize: "0.80em",
              fontWeight: 600,
              padding: "0.2em 0.5em",
              borderRadius: "6px",
              background: zeeguuOrange,
              color: "white",
              marginLeft: "0.25em"
            }}
          >
            YOU
          </span>
        )}
      </td>

      {showUsernameColumn && (
        <td style={{ padding: "0.5em", borderBottom: "1px solid #ddd", color: isDark ? "#b5b5b5" : "#666" }}>
          {usernameText}
        </td>
      )}

      {metrics.map((metric) => (
        <td
          key={metric.key}
          style={{
            padding: "0.5em",
            borderBottom: "1px solid #ddd",
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
