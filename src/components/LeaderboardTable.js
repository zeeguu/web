import React, { useContext, useEffect, useMemo, useState } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";

function getMetricValue(entry) {
  if (!entry || typeof entry !== "object") return 0;

  if (Number.isFinite(Number(entry.value))) {
    return Number(entry.value);
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

function collectIdentityTokens(userDetails) {
  const usernameToken = normalizeValue(findFirstDefinedValue(userDetails, ["username", "name"]));

  return [usernameToken].filter(Boolean);
}

function collectEntryTokens(entry) {
  const tokens = new Set();

  function visit(value, keyHint = "") {
    if (value === null || value === undefined) return;

    if (typeof value === "string" || typeof value === "number") {
      const normalized = normalizeValue(value);
      if (!normalized) return;

      const key = normalizeValue(keyHint);
      if (!key || key.includes("user") || key.includes("name")) {
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

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function computeHalfMonthPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  let from, to;

  if (day <= 15) {
    from = new Date(year - 1, month, 1);
    to = new Date(year, month, 15);
  } else {
    from = new Date(year - 1, month, 16);
    to = new Date(year, month + 1, 0);
  }

  const pad = (n) => String(n).padStart(2, "0");

  const fromStr = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`;
  const toStr = `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`;

  return { from, to, fromStr, toStr };
}

function LeaderboardTable({
  title,
  metricLabel,
  formatMetric = (value) => String(value),
  emptyMessage = "No leaderboard data available yet.",
  errorMessage = "Could not load leaderboard.",
  leaderboards = null,
}) {
  const api = useContext(APIContext);
  const { isDark } = useContext(ThemeContext);
  const { userDetails } = useContext(UserContext);

  const period = useMemo(() => computeHalfMonthPeriod(), []);

  const resolvedLeaderboards = useMemo(() => {
    if (Array.isArray(leaderboards) && leaderboards.length > 0) {
      return leaderboards.map((item, index) => ({
        key: item.key || `leaderboard-${index}`,
        tabLabel: item.tabLabel || item.metricLabel || item.title || `Metric ${index + 1}`,
        title: item.title || title || `Leaderboard ${index + 1}`,
        metricLabel: item.metricLabel || metricLabel || "Metric",
        formatMetric: item.formatMetric || formatMetric,
        emptyMessage: item.emptyMessage || emptyMessage,
        errorMessage: item.errorMessage || errorMessage,
      }));
    }

    return [{
      key: "default",
      tabLabel: metricLabel || "Metric",
      title,
      metricLabel,
      formatMetric,
      emptyMessage,
      errorMessage,
    }];
  }, [
    leaderboards,
    title,
    metricLabel,
    formatMetric,
    emptyMessage,
    errorMessage,
  ]);
  const [selectedLeaderboardKey, setSelectedLeaderboardKey] = useState(() => resolvedLeaderboards[0]?.key || "default");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resolvedLeaderboards.some((item) => item.key === selectedLeaderboardKey)) {
      setSelectedLeaderboardKey(resolvedLeaderboards[0]?.key || "default");
    }
  }, [resolvedLeaderboards, selectedLeaderboardKey]);

  const activeLeaderboard = useMemo(() => (
    resolvedLeaderboards.find((item) => item.key === selectedLeaderboardKey) || resolvedLeaderboards[0]
  ), [resolvedLeaderboards, selectedLeaderboardKey]);

  const activeErrorMessage = activeLeaderboard?.errorMessage || errorMessage;

  useEffect(() => {
    if (!selectedLeaderboardKey) {
      setError(activeErrorMessage);
      setLeaderboardData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    api.getLeaderboard(selectedLeaderboardKey, period.fromStr, period.toStr, (data) => {
      if (!Array.isArray(data)) {
        setError(activeErrorMessage);
        setLeaderboardData([]);
        setIsLoading(false);
        return;
      }

      const sorted = [...data].sort(
        (a, b) => getMetricValue(b) - getMetricValue(a),
      );

      setLeaderboardData(sorted);
      setIsLoading(false);
    });
  }, [api, activeErrorMessage, selectedLeaderboardKey, period.fromStr, period.toStr]);

  const tableHeaderStyle = useMemo(
    () => ({
      background: isDark ? "#2b2b2b" : "#f5f5f5",
      color: isDark ? "#f1f1f1" : "#222",
    }),
    [isDark],
  );

  const periodLabel = `${formatDateLabel(period.from)} - ${formatDateLabel(period.to)}`;

  return (
    <section style={{ width: "100%", maxWidth: "760px"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "0.75em",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.95em",
            color: isDark ? "#c6c6c6" : "#555",
          }}
        >
          Current period: {periodLabel}
        </p>
      </div>

      {resolvedLeaderboards.length > 1 && (
        <div style={{ display: "flex", gap: "0.5em", flexWrap: "wrap", marginTop: "0.75em" }}>
          {resolvedLeaderboards.map((item) => {
            const isActive = item.key === selectedLeaderboardKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedLeaderboardKey(item.key)}
                style={{
                  borderRadius: "999px",
                  border: `1px solid ${isActive ? "#1f6feb" : "#c8d1dc"}`,
                  background: isActive ? "#1f6feb" : (isDark ? "#20262e" : "#fff"),
                  color: isActive ? "#fff" : (isDark ? "#d4d8dd" : "#2f3b4b"),
                  padding: "0.35em 0.85em",
                  cursor: "pointer",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>
      )}

      {isLoading && <p>Loading leaderboard...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!isLoading && !error && leaderboardData.length === 0 && <p>{activeLeaderboard?.emptyMessage || emptyMessage}</p>}

      {!isLoading && !error && leaderboardData.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={tableHeaderStyle}>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>Rank</th>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>User</th>
              <th style={{ padding: "0.5em", border: "1px solid #ddd" }}>{activeLeaderboard?.metricLabel || metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => {
              const metricValue = getMetricValue(entry);
              const userEntry = entry?.user || entry;
              const identityTokens = collectIdentityTokens(userDetails);
              const entryTokens = collectEntryTokens(entry);

              const isCurrentUser = (identityTokens.length > 0 && identityTokens.some((token) => entryTokens.has(token)));

              const resolvedName =
                typeof userEntry === "string"
                  ? userEntry
                  : userEntry?.username
                    ? `${userEntry.username} (${userEntry?.name || "Unknown"})`
                    : (userEntry?.name || "Unknown");

              return (
                <LeaderboardRow
                  key={`${activeLeaderboard?.title || title}-${findFirstDefinedValue(userEntry, ["username", "name"]) || index}`}
                  rank={index + 1}
                  name={isCurrentUser ? <b>You</b> : resolvedName}
                  metrics={[
                    {
                      key: `${activeLeaderboard?.metricLabel || metricLabel}-${index}`,
                      value: (activeLeaderboard?.formatMetric || formatMetric)(metricValue),
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