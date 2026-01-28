import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserActivityByDay = function (callback) {
  this._getJSON("activity_by_day", callback);
};

Zeeguu_API.prototype.getDailyStreak = function (callback) {
  this._getJSON("daily_streak", callback);
};
