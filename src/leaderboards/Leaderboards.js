import React, { useContext, useEffect, useMemo, useState } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import * as s from "./Leaderboards.sc";
import { LEADERBOARD_TYPES } from "./leaderboardTypes";

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

function Leaderboards({
  metricLabel,
  icon,
  formatMetric = (value) => String(value),
  emptyMessage = "No leaderboard data available yet.",
  errorMessage = "Could not load leaderboard.",
  leaderboards = LEADERBOARD_TYPES,
  navigationHandler,
}) {
  const api = useContext(APIContext);
  const { isDark } = useContext(ThemeContext);
  const { userDetails } = useContext(UserContext);

  const period = useMemo(() => computeHalfMonthPeriod(), []);

  const resolvedLeaderboards = useMemo(() => {
    if (Array.isArray(leaderboards) && leaderboards.length > 0) {
      return leaderboards.map((item, index) => ({
        key: item.key || `leaderboard-${index}`,
        tabLabel: item.tabLabel || item.metricLabel || `Metric ${index + 1}`,
        metricLabel: item.metricLabel || metricLabel || "Metric",
        formatMetric: item.formatMetric || formatMetric,
        icon: item.icon || icon,
      }));
    }

    return [
      {
        key: "default",
        tabLabel: metricLabel || "Metric",
        icon,
        metricLabel,
        formatMetric,
      },
    ];
  }, [leaderboards, icon, metricLabel, formatMetric]);
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

  useEffect(() => {
    if (!selectedLeaderboardKey) {
      setError(errorMessage);
      setLeaderboardData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    api.getLeaderboard(selectedLeaderboardKey, period.fromStr, period.toStr, (data) => {
      if (!Array.isArray(data)) {
        setError(errorMessage);
        setLeaderboardData([]);
        setIsLoading(false);
        return;
      }

      const rankedData = assignRanks(data);
      setLeaderboardData(rankedData);

      setIsLoading(false);
    });
  }, [api, selectedLeaderboardKey, period.fromStr, period.toStr]);

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

  const periodLabel = `${formatDateLabel(period.from)} - ${formatDateLabel(period.to)}`;

  const handleViewFriendProfile = (friendId) => {
    if (!friendId || !navigationHandler) {
      return;
    }
    navigationHandler(friendId);
  };

  return (
    <s.Container>
      <s.Header>
        <s.PeriodLabel>Current period: {periodLabel}</s.PeriodLabel>
      </s.Header>

      {resolvedLeaderboards.length > 1 && (
        <s.TabsWrapper>
          {resolvedLeaderboards.map((item) => {
            const isActive = item.key === selectedLeaderboardKey;

            return (
              <s.TabButton key={item.key} $active={isActive} onClick={() => setSelectedLeaderboardKey(item.key)}>
                {item.icon && React.createElement(item.icon, { fontSize: "small" })}
                <span>{item.tabLabel}</span>
              </s.TabButton>
            );
          })}
        </s.TabsWrapper>
      )}

      {isLoading && <p>Loading leaderboard...</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!isLoading && !error && leaderboardData.length === 0 && <p>{emptyMessage}</p>}

      {!isLoading && !error && leaderboardData.length > 0 && (
        <s.Table>
          <thead>
            <tr>
              <s.TableHeadCell>Rank</s.TableHeadCell>
              <s.TableHeadCell>User</s.TableHeadCell>
              <s.TableHeadCell>{activeLeaderboard?.metricLabel}</s.TableHeadCell>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => {
              const metricValue = getMetricValue(entry);
              const userEntry = entry?.user || entry;
              const identityTokens = collectIdentityTokens(userDetails);
              const entryTokens = collectEntryTokens(entry);

              const isCurrentUser = identityTokens.length > 0 && identityTokens.some((token) => entryTokens.has(token));

              return (
                <LeaderboardRow
                  key={`${selectedLeaderboardKey}-${userEntry.username}`}
                  rank={entry.rank}
                  user={userEntry}
                  metrics={[
                    {
                      key: `${activeLeaderboard?.metricLabel || metricLabel}-${index}`,
                      value: (activeLeaderboard?.formatMetric || formatMetric)(metricValue),
                      align: "center",
                    },
                  ]}
                  highlight={isCurrentUser}
                  isDark={isDark}
                  onViewProfile={handleViewFriendProfile}
                />
              );
            })}
          </tbody>
        </s.Table>
      )}
    </s.Container>
  );
}

export default Leaderboards;
