import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getUserActivityByDay = function (callback) {
  this._get("activity_by_day", callback);
};
