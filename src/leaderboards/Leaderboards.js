import React, { useContext, useEffect, useMemo, useState } from "react";
import strings from "../i18n/definitions";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import LeaderboardRow from "./LeaderboardRow";
import { APIContext } from "../contexts/APIContext";
import { UserContext } from "../contexts/UserContext";
import * as s from "./Leaderboards.sc";
import { LEADERBOARD_SCOPES, LEADERBOARD_TYPES } from "./leaderboardTypes";
import Selector from "../components/Selector";
import { endOfWeek, getISOWeek, getISOWeekYear, startOfWeek } from "date-fns";
import { useScrollActiveIntoView } from "../hooks/useScrollActiveIntoView";

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

function computeWeeklyPeriod(weekShift = 0) {
  const now = new Date();
  const now_shifted = new Date(now.getTime() + weekShift * 7 * 24 * 60 * 60 * 1000);

  const monday = startOfWeek(now_shifted, { weekStartsOn: 1 });
  const sunday = endOfWeek(now_shifted, { weekStartsOn: 1 });

  const week = getISOWeek(now_shifted);
  const year = getISOWeekYear(now_shifted);

  const pad = (n) => String(n).padStart(2, "0");

  const fromStr = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}T00:00:00`;
  const toStr = `${sunday.getFullYear()}-${pad(sunday.getMonth() + 1)}-${pad(sunday.getDate())}T23:59:59`;

  return {
    from: monday,
    to: sunday,
    fromStr,
    toStr,
    week,
    year,
  };
}

export default function Leaderboards({
  emptyMessage = strings.noLeaderboardData,
  errorMessage = strings.couldNotLoadLeaderboard,
  scope,
  leaderboardTypes = LEADERBOARD_TYPES,
  navigationHandler,
}) {
  const api = useContext(APIContext);
  const { userDetails } = useContext(UserContext);
  const [periodShiftInWeeks, setPeriodShiftInWeeks] = useState(0);

  const period = useMemo(() => computeWeeklyPeriod(periodShiftInWeeks), [periodShiftInWeeks]);

  const [selectedLeaderboardKey, setSelectedLeaderboardKey] = useState(() => leaderboardTypes[0]?.key || "default");
  const setTabRef = useScrollActiveIntoView(selectedLeaderboardKey);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeLeaderboard = useMemo(
    () => leaderboardTypes.find((item) => item.key === selectedLeaderboardKey) || leaderboardTypes[0],
    [leaderboardTypes, selectedLeaderboardKey],
  );

  function handleData(data) {
    if (!Array.isArray(data)) {
      setError(errorMessage);
      setLeaderboardData([]);
      setIsLoading(false);
      return;
    }

    const rankedData = assignRanks(data);
    setLeaderboardData(rankedData);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!selectedLeaderboardKey) {
      setError(errorMessage);
      setLeaderboardData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (scope === LEADERBOARD_SCOPES.FRIENDS) {
      api.getFriendsLeaderboard(selectedLeaderboardKey, period.fromStr, period.toStr, handleData);
    } else if (scope === LEADERBOARD_SCOPES.COHORT) {
      if (!selectedCohort) {
        setLeaderboardData([]);
        setIsLoading(false);
        return;
      }
      api.getCohortLeaderboard(selectedCohort, selectedLeaderboardKey, period.fromStr, period.toStr, handleData);
    }
  }, [api, selectedLeaderboardKey, period.fromStr, period.toStr, scope, selectedCohort]);

  useEffect(() => {
    if (scope === LEADERBOARD_SCOPES.COHORT) {
      api.getStudent((data) => {
        if (data?.cohorts?.length) {
          setCohorts(data.cohorts);
          setSelectedCohort(data.cohorts[0].id);
        }
      });
    }
  }, [api, scope]);

  function assignRanks(data) {
    if (!Array.isArray(data)) return [];

    const sorted = [...data].sort((a, b) => {
      const valueDiff = getMetricValue(b) - getMetricValue(a);
      if (valueDiff !== 0) return valueDiff;
      const usernameA = a.user?.username?.toLowerCase() ?? "";
      const usernameB = b.user?.username?.toLowerCase() ?? "";
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

  const handleViewFriendProfile = (friendId) => {
    if (!friendId || !navigationHandler) {
      return;
    }
    navigationHandler(friendId);
  };

  const handleTabClick = (tab) => {
    setSelectedLeaderboardKey(tab.key);
  };

  return (
    <s.Container>
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
        <s.PeriodNavButton
          type="button"
          onClick={() => setPeriodShiftInWeeks((prev) => prev - 1)}
          aria-label="Previous period"
        >
          <ChevronLeftRoundedIcon fontSize="large" />
        </s.PeriodNavButton>
        <s.PeriodContainer>
          <s.WeekLabel>
            Week {period.week}, {period.year}
          </s.WeekLabel>
          <s.PeriodLabel>
            {formatDateLabel(period.from)} - {formatDateLabel(period.to)}
          </s.PeriodLabel>
        </s.PeriodContainer>
        {periodShiftInWeeks < 0 && (
          <s.PeriodNavButton
            type="button"
            onClick={() => setPeriodShiftInWeeks((prev) => Math.min(prev + 1, 0))}
            aria-label="Next period"
          >
            <ChevronRightRoundedIcon fontSize="large" />
          </s.PeriodNavButton>
        )}
        {periodShiftInWeeks >= 0 && <s.PeriodNavSpacer aria-hidden="true" />}
      </div>

      {leaderboardTypes.length > 1 && (
        <s.TabsWrapper>
          {leaderboardTypes.map((item) => {
            const isActive = item.key === selectedLeaderboardKey;

            return (
              <s.TabButton
                key={item.key}
                ref={setTabRef(item.key)}
                $active={isActive}
                onClick={() => handleTabClick(item)}
              >
                <span>{item.tabLabel}</span>
              </s.TabButton>
            );
          })}
        </s.TabsWrapper>
      )}

      {scope === LEADERBOARD_SCOPES.COHORT && cohorts.length > 1 && (
        <div style={{ marginBottom: "1rem", width: "fit-content" }}>
          <Selector
            id="cohort-select"
            options={cohorts.map((c) => ({ value: c.id, label: c.name }))}
            selectedValue={selectedCohort}
            onChange={(e) => setSelectedCohort(Number(e.target.value))}
            optionLabel={(option) => option.label}
            optionValue={(option) => option.value}
            placeholder={strings.selectClassroom}
          />
        </div>
      )}

      {isLoading && <p>{strings.loadingLeaderboard}</p>}
      {!isLoading && error && <p style={{ color: "#b00020" }}>{error}</p>}
      {!isLoading && !error && leaderboardData.length === 0 && <p>{emptyMessage}</p>}

      {!isLoading && !error && leaderboardData.length > 0 && (
        <s.Table>
          <thead>
            <tr>
              <s.TableHeadCell style={{ width: "10%" }}>{strings.leaderboardRank}</s.TableHeadCell>
              <s.TableHeadCell style={{ width: "65%" }}>{strings.leaderboardUser}</s.TableHeadCell>
              <s.TableHeadCell style={{ width: "25%" }}>{activeLeaderboard?.metricLabel}</s.TableHeadCell>
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
