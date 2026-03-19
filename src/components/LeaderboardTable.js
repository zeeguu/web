import React, { useContext, useEffect, useMemo, useState } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";

function getMetricValue(entry, metricKey) {
  if (!entry || typeof entry !== "object") return 0;

  if (metricKey && Number.isFinite(Number(entry[metricKey]))) {
    return Number(entry[metricKey]);
  }

  const fallbackMetric = Object.keys(entry)
    .filter((key) => key !== "user")
    .map((key) => entry[key])
    .find((value) => Number.isFinite(Number(value)));

  return Number.isFinite(Number(fallbackMetric)) ? Number(fallbackMetric) : 0;
}

function normalizeValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

function findFirstDefinedValue(objectLike, keys = []) {
  if (!objectLike || typeof objectLike !== "object") return undefined;

  for (const key of keys) {
    if (objectLike[key] !== undefined && objectLike[key] !== null) {
      return objectLike[key];
    }
  }

  return undefined;
}

function hasCurrentUserFlag(objectLike) {
  if (!objectLike || typeof objectLike !== "object") return false;

  const possibleFlags = ["is_current_user", "current_user", "is_me", "me", "self"];
  return possibleFlags.some((flag) => objectLike[flag] === true);
}

function collectIdentityTokens(userDetails) {
  const idToken = normalizeValue(findFirstDefinedValue(userDetails, ["id", "user_id", "userId"]));
  const usernameToken = normalizeValue(findFirstDefinedValue(userDetails, ["username", "name"]));
//   const emailToken = normalizeValue(findFirstDefinedValue(userDetails, ["email"]));

  return [idToken, usernameToken].filter(Boolean);
}

function collectEntryTokens(entry) {
  const tokens = new Set();

  function visit(value, keyHint = "") {
    if (value === null || value === undefined) return;

    if (typeof value === "string" || typeof value === "number") {
      const normalized = normalizeValue(value);
      if (!normalized) return;

      const key = normalizeValue(keyHint);
      if (!key || key.includes("id") || key.includes("user") || key.includes("name") || key.includes("email")) {
        tokens.add(normalized);
      }
      return;
    }

    if (typeof value !== "object") return;

    Object.entries(value).forEach(([k, v]) => visit(v, k));
  }

  visit(entry?.user, "user");
  visit(entry, "entry");

  return tokens;
}

function LeaderboardTable({
  title,
  endpointMethod,
  metricLabel,
  metricKey,
  formatMetric = (value) => String(value),
  emptyMessage = "No leaderboard data available yet.",
  errorMessage = "Could not load leaderboard.",
}) {
  const api = useContext(APIContext);
  const { isDark } = useContext(ThemeContext);
  const { userDetails } = useContext(UserContext);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpointMethod || typeof api[endpointMethod] !== "function") {
      setError(errorMessage);
      setLeaderboardData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    api[endpointMethod]((data) => {
      if (!Array.isArray(data)) {
        setError(errorMessage);
        setLeaderboardData([]);
        setIsLoading(false);
        return;
      }

      const sorted = [...data].sort(
        (a, b) => getMetricValue(b, metricKey) - getMetricValue(a, metricKey),
      );

      setLeaderboardData(sorted);
      setIsLoading(false);
    });
  }, [api, endpointMethod, errorMessage, metricKey]);

  const tableHeaderStyle = useMemo(
    () => ({
      background: isDark ? "#2b2b2b" : "#f5f5f5",
      color: isDark ? "#f1f1f1" : "#222",
    }),
    [isDark],
  );

  return (
    <section style={{ width: "100%", maxWidth: "760px", marginTop: "2em" }}>
      <h2>{title}</h2>

      {isLoading && <p>Loading leaderboard...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!isLoading && !error && leaderboardData.length === 0 && <p>{emptyMessage}</p>}

      {!isLoading && !error && leaderboardData.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>Rank</th>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>User</th>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>{metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => {
              const metricValue = getMetricValue(entry, metricKey);
              const userEntry = entry?.user || entry;
              const identityTokens = collectIdentityTokens(userDetails);
              const entryTokens = collectEntryTokens(entry);

              const isCurrentUser = (identityTokens.length > 0 && identityTokens.some((token) => entryTokens.has(token)));

              const resolvedName =
                typeof userEntry === "string"
                  ? userEntry
                  : userEntry?.username
                    ? `@${userEntry.username} (${userEntry?.name || "Unknown"})`
                    : (userEntry?.name || "Unknown");

              return (
                <LeaderboardRow
                  key={`${title}-${findFirstDefinedValue(userEntry, ["id", "user_id", "userId", "username", "name"]) || index}`}
                  rank={index + 1}
                  name={isCurrentUser ? `${resolvedName} (You)` : resolvedName}
                  metrics={[
                    {
                      key: `${metricLabel}-${index}`,
                      value: formatMetric(metricValue),
                      align: "center",
                    },
                  ]}
                  showUsernameColumn={false}
                  highlight={isCurrentUser}
                  isDark={isDark}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default LeaderboardTable;