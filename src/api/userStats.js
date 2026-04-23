import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserActivityByDay = function (callback) {
  this._getJSON("activity_by_day", callback);
};

Zeeguu_API.prototype.getDailyStreak = function (callback) {
  this._getJSON("daily_streak", callback);
};

Zeeguu_API.prototype.getAllLanguageStreaks = function (callback) {
  this._getJSON("all_language_streaks", callback);
};

Zeeguu_API.prototype.getMyLanguageStreakHistory = function (callback) {
  this._getJSON("language_streak_history", callback);
};

Zeeguu_API.prototype.getFriendLanguageStreakHistory = function (username, callback) {
  this._getJSON(`friend_language_streak_history/${username}`, callback);
};
