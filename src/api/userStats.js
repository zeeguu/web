import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserActivityByDay = function (callback) {
  this._getJSON("activity_by_day", callback);
};
