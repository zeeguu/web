import { Zeeguu_API } from "./classDef";

function fetchFriendsLeaderboard(api, metric, fromDate, toDate, callback) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    callback([]);
    return;
  }

  const params = new URLSearchParams({
    metric,
    from_date: fromDate,
    to_date: toDate,
  });

  api._getJSON(`friends_leaderboard?${params.toString()}`, (data) => {
    callback(data);
  });
}

function fetchCohortLeaderboard(api, cohortId, metric, fromDate, toDate, callback) {
  if (!metric || !fromDate || !toDate) {
    console.error("Leaderboard requires metric, fromDate, and toDate");
    callback([]);
    return;
  }

  const params = new URLSearchParams({
    metric,
    from_date: fromDate,
    to_date: toDate,
  });

  api._getJSON(`cohort_leaderboard/${cohortId}?${params.toString()}`, (data) => {
    callback(data);
  });
}


Zeeguu_API.prototype.getFriendsLeaderboard = function(metric, fromDate, toDate, callback) {
  fetchFriendsLeaderboard(this, metric, fromDate, toDate, callback);
};

Zeeguu_API.prototype.getCohortLeaderboard = function(cohortId, metric, fromDate, toDate, callback) {
  fetchCohortLeaderboard(this, cohortId, metric, fromDate, toDate, callback);
};