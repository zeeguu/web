import React, { useContext, useEffect, useMemo, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import { orange300 } from "@/components/colors";

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

function computeWeeklyPeriod(weekShift = 0) {
  const now = new Date();
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate() + weekShift * 7);
  const from = new Date(to.getFullYear(), to.getMonth(), to.getDate() - 6);

  const pad = (n) => String(n).padStart(2, "0");

  const fromStr = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`;
  const toStr = `${to.getFullYear()}-${pad(to.getMonth() + 1)}-${pad(to.getDate())}`;

  return { from, to, fromStr, toStr };
}

function LeaderboardTable({
  title,
  metricLabel,
  icon,
  formatMetric = (value) => String(value),
  emptyMessage = "No leaderboard data available yet.",
  errorMessage = "Could not load leaderboard.",
  leaderboards = null,
}) {
  const api = useContext(APIContext);
  const { isDark } = useContext(ThemeContext);
  const { userDetails } = useContext(UserContext);
  const [periodShiftInWeeks, setPeriodShiftInWeeks] = useState(0);

  const period = useMemo(() => computeWeeklyPeriod(periodShiftInWeeks), [periodShiftInWeeks]);

  const resolvedLeaderboards = useMemo(() => {
    if (Array.isArray(leaderboards) && leaderboards.length > 0) {
      return leaderboards.map((item, index) => ({
        key: item.key || `leaderboard-${index}`,
        tabLabel: item.tabLabel || item.metricLabel || item.title || `Metric ${index + 1}`,
        title: item.title || title || `Leaderboard ${index + 1}`,
        metricLabel: item.metricLabel || metricLabel || "Metric",
        formatMetric: item.formatMetric || formatMetric,
        icon: item.icon || icon,
        emptyMessage: item.emptyMessage || emptyMessage,
        errorMessage: item.errorMessage || errorMessage,
      }));
    }

    return [
      {
        key: "default",
        tabLabel: metricLabel || "Metric",
        title,
        icon,
        metricLabel,
        formatMetric,
        emptyMessage,
        errorMessage,
      },
    ];
  }, [leaderboards, title, icon, metricLabel, formatMetric, emptyMessage, errorMessage]);
  const [selectedLeaderboardKey, setSelectedLeaderboardKey] = useState(() => resolvedLeaderboards[0]?.key || "default");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resolvedLeaderboards.some((item) => item.key === selectedLeaderboardKey)) {
      setSelectedLeaderboardKey(resolvedLeaderboards[0]?.key || "default");
    }
  }, [resolvedLeaderboards, selectedLeaderboardKey]);

  const activeLeaderboard = useMemo(
    () => resolvedLeaderboards.find((item) => item.key === selectedLeaderboardKey) || resolvedLeaderboards[0],
    [resolvedLeaderboards, selectedLeaderboardKey],
  );

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

      const rankedData = assignRanks(data);
      setLeaderboardData(rankedData);

      setIsLoading(false);
    });
  }, [api, activeErrorMessage, selectedLeaderboardKey, period.fromStr, period.toStr]);

  function assignRanks(data) {
    if (!Array.isArray(data)) return [];

    const sorted = [...data].sort((a, b) => {
      const valueDiff = getMetricValue(b) - getMetricValue(a);
      if (valueDiff !== 0) return valueDiff;

      const usernameA = (a.user?.username || a.user?.name || "").toLowerCase();
      const usernameB = (b.user?.username || b.user?.name || "").toLowerCase();
      return usernameA.localeCompare(usernameB);
    });

    let lastValue = null;
    let lastRank = 0;

    return sorted.map((entry, index) => {
      const value = getMetricValue(entry);
      let rank;

      if (value === lastValue) {
        rank = lastRank;
      } else {
        rank = index + 1;
        lastValue = value;
        lastRank = rank;
      }

      return { ...entry, rank };
    });
  }

  const tableHeaderStyle = useMemo(
    () => ({
      background: isDark ? "#2b2b2b" : "#f5f5f5",
      color: isDark ? "#f1f1f1" : "#222",
    }),
    [isDark],
  );

  const periodLabel = `${formatDateLabel(period.from)} - ${formatDateLabel(period.to)}`;

  return (
    <section style={{ width: "100%", maxWidth: "760px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5em",
          margin: "0",
          padding: "0",
        }}
      >
        <button
          type="button"
          onClick={() => setPeriodShiftInWeeks((prev) => prev - 1)}
          aria-label="Previous period"
          style={{
            padding: 0,
            border: "none",
            background: "transparent",
            color: isDark ? "#f1f1f1" : "#222",
            cursor: "pointer",
          }}
        >
          <ChevronLeftRoundedIcon fontSize="large" />
        </button>
        <p
          style={{
            margin: 0,
            fontSize: "0.90em",
            color: isDark ? "#c6c6c6" : "#555",
            textAlign: "center",
            flex: 1,
          }}
        >
          Period: {periodLabel}
        </p>
        <button
          type="button"
          onClick={() => setPeriodShiftInWeeks((prev) => Math.min(prev + 1, 0))}
          disabled={periodShiftInWeeks >= 0}
          aria-label="Next period"
          style={{
            padding: 0,
            border: "none",
            background: "transparent",
            color: isDark ? "#f1f1f1" : "#222",
            cursor: periodShiftInWeeks >= 0 ? "not-allowed" : "pointer",
            opacity: periodShiftInWeeks >= 0 ? 0.55 : 1,
          }}
        >
          <ChevronLeftRoundedIcon fontSize="large" style={{ transform: "rotate(180deg)" }} />
        </button>
      </div>

      {resolvedLeaderboards.length > 1 && (
        <div
          style={{
            display: "inline-flex",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          {resolvedLeaderboards.map((item, idx) => {
            const isActive = item.key === selectedLeaderboardKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedLeaderboardKey(item.key)}
                style={{
                  display: "flex",
                  fontSize: "1em",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35em",
                  padding: "0.75em 0.75em",
                  background: isActive ? orange300 : "var(--active-bg)",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: isActive ? 500 : 400,
                  transition: "background 0.2s",
                  boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.25)" : "0 1px 2px rgba(0,0,0,0.1)",
                  transform: isActive ? "translateY(-1px)" : "none",
                }}
              >
                {item.icon && React.createElement(item.icon, { fontSize: "small" })}
                <span>{item.tabLabel}</span>
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
            <tr>
              <th style={{ padding: "0.5em" }}>Rank</th>
              <th style={{ padding: "0.5em" }}>User</th>
              <th style={{ padding: "0.5em" }}>{activeLeaderboard?.metricLabel || metricLabel}</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => {
              const metricValue = getMetricValue(entry);
              const userEntry = entry?.user || entry;
              const identityTokens = collectIdentityTokens(userDetails);
              const entryTokens = collectEntryTokens(entry);

              const isCurrentUser = identityTokens.length > 0 && identityTokens.some((token) => entryTokens.has(token));

              const resolvedName =
                typeof userEntry === "string"
                  ? userEntry
                  : userEntry?.username
                    ? `${userEntry.username} (${userEntry?.name || "Unknown"})`
                    : userEntry?.name || "Unknown";

              return (
                <LeaderboardRow
                  key={`${activeLeaderboard?.title || title}-${findFirstDefinedValue(userEntry, ["username", "name"]) || index}`}
                  rank={entry.rank}
                  name={resolvedName}
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
