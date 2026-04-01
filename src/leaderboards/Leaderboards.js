import React, { useContext, useEffect, useMemo, useState } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserContext } from "../contexts/UserContext";
import * as s from "./Leaderboards.sc";
import { LEADERBOARD_TYPES } from "./leaderboardTypes";

function getMetricValue(entry) {
  return Number(entry.value || 0);
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

export default function Leaderboards({
  emptyMessage = "No leaderboard data available yet.",
  errorMessage = "Could not load leaderboard.",
  leaderboardTypes = LEADERBOARD_TYPES,
  navigationHandler,
}) {
  const api = useContext(APIContext);
  const { isDark } = useContext(ThemeContext);
  const { userDetails } = useContext(UserContext);

  const period = useMemo(() => computeHalfMonthPeriod(), []);

  const [selectedLeaderboardKey, setSelectedLeaderboardKey] = useState(() => leaderboardTypes[0]?.key || "default");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeLeaderboard = useMemo(
    () => leaderboardTypes.find((item) => item.key === selectedLeaderboardKey) || leaderboardTypes[0],
    [leaderboardTypes, selectedLeaderboardKey],
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
      const usernameA = a.user?.username.toLowerCase();
      const usernameB = b.user?.username.toLowerCase();
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

      {leaderboardTypes.length > 1 && (
        <s.TabsWrapper>
          {leaderboardTypes.map((item) => {
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
              const userEntry = entry?.user;

              const isCurrentUser =
                userDetails?.username &&
                userEntry?.username &&
                userDetails.username.toLowerCase() === userEntry.username.toLowerCase();

              return (
                <LeaderboardRow
                  key={`${selectedLeaderboardKey}-${userEntry?.username || index}`}
                  rank={entry.rank}
                  user={userEntry}
                  metrics={[
                    {
                      key: `${activeLeaderboard?.metricLabel}-${index}`,
                      value: activeLeaderboard.formatMetric(metricValue),
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
