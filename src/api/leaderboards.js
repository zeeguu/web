import { Zeeguu_API } from "./classDef";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCurrentHalfMonthPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  if (day <= 15) {
    return {
      fromDate: formatDate(new Date(year, month, 1)),
      toDate: formatDate(new Date(year, month, 15)),
    };
  }

  return {
    fromDate: formatDate(new Date(year, month, 16)),
    toDate: formatDate(new Date(year, month + 1, 0)),
  };
}

function resolveLeaderboardDates(fromDate, toDate) {
  if (fromDate && toDate) {
    return { fromDate, toDate };
  }

  return getCurrentHalfMonthPeriod();
}

function getLeaderboardCallbackAndDates(fromDate, toDate, callback) {
  if (typeof fromDate === "function") {
    return {
      callback: fromDate,
      ...getCurrentHalfMonthPeriod(),
    };
  }

  return {
    callback: typeof callback === "function" ? callback : () => {},
    ...resolveLeaderboardDates(fromDate, toDate),
  };
}

function fetchLeaderboardByDateRange(api, endpoint, fromDate, toDate, callback) {
  const resolved = getLeaderboardCallbackAndDates(fromDate, toDate, callback);
  const params = new URLSearchParams({
    from_date: resolved.fromDate,
    to_date: resolved.toDate,
  });

  api._getJSON(`${endpoint}?${params.toString()}`, (data) => {
    resolved.callback(data);
  });
}

Zeeguu_API.prototype.getExerciseLeaderboard = function(fromDate, toDate, callback) {
  fetchLeaderboardByDateRange(
    this,
    "friends_exercise_leaderboard",
    fromDate,
    toDate,
    callback,
  );
};

Zeeguu_API.prototype.getReadArticlesLeaderboard = function(fromDate, toDate, callback) {
  fetchLeaderboardByDateRange(
    this,
    "friends_read_articles_leaderboard",
    fromDate,
    toDate,
    callback,
  );
};

Zeeguu_API.prototype.getReadingSessionsLeaderboard = function(fromDate, toDate, callback) {
  fetchLeaderboardByDateRange(
    this,
    "friends_reading_sessions_leaderboard",
    fromDate,
    toDate,
    callback,
  );
};