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

Zeeguu_API.prototype.getAllDailyStreakForUser = function (callback) {
  this._getJSON("all_language_streaks_detailed", callback);
};

Zeeguu_API.prototype.getAllDailyStreakForFriend = function (userId, callback) {
  this._getJSON(`all_language_streaks_detailed/${userId}`, callback);
};
