import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getSessionHistory = function (days = 7, callback) {
  this._getJSON(`session_history?days=${days}`, callback);
};

Zeeguu_API.prototype.getSessionHistoryByRange = function (fromDate, toDate, callback) {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
  });
  this._getJSON(`session_history?${params.toString()}`, callback);
};
