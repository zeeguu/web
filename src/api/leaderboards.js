import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getExerciseLeaderboard = function(callback) {
  this._getJSON(`friends_exercise_leaderboard`, (data) => {
    callback(data);
  });
};

Zeeguu_API.prototype.getReadArticlesLeaderboard = function(callback) {
  this._getJSON(`friends_read_articles_leaderboard`, (data) => {
    callback(data);
  });
};

Zeeguu_API.prototype.getReadingSessionsLeaderboard = function(callback) {
  this._getJSON(`friends_reading_sessions_leaderboard`, (data) => {
    callback(data);
  });
};