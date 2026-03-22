import { Zeeguu_API } from "./classDef";

function fetchLeaderboard(api, metric, fromDate, toDate, callback) {
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


Zeeguu_API.prototype.getLeaderboard = function(metric, fromDate, toDate, callback) {
  fetchLeaderboard(this, metric, fromDate, toDate, callback);
};