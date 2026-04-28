import { Zeeguu_API } from "./classDef";

function leaderboardParams(metric, fromDate, toDate) {
  return new URLSearchParams({
    metric,
    from_date: fromDate,
    to_date: toDate,
  }).toString();
}

Zeeguu_API.prototype.getFriendsLeaderboard = function (metric, fromDate, toDate, callback, onError) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    callback([]);
    return;
  }
  this._getJSON(`friends_leaderboard?${leaderboardParams(metric, fromDate, toDate)}`, callback, { onError });
};

Zeeguu_API.prototype.getCohortLeaderboard = function (cohortId, metric, fromDate, toDate, callback, onError) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    callback([]);
    return;
  }
  this._getJSON(`cohort_leaderboard/${cohortId}?${leaderboardParams(metric, fromDate, toDate)}`, callback, { onError });
};
