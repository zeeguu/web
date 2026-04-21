import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getFriendsLeaderboard = function (metric, fromDate, toDate, { onError } = {}) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    return Promise.resolve([]);
  }
  const params = new URLSearchParams({ metric, from_date: fromDate, to_date: toDate });
  return this._fetchJSON(`friends_leaderboard?${params.toString()}`, { onError });
};

Zeeguu_API.prototype.getCohortLeaderboard = function (cohortId, metric, fromDate, toDate, { onError } = {}) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    return Promise.resolve([]);
  }
  const params = new URLSearchParams({ metric, from_date: fromDate, to_date: toDate });
  return this._fetchJSON(`cohort_leaderboard/${cohortId}?${params.toString()}`, { onError });
};