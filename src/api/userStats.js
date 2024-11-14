import { Zeeguu_API } from "./classDef";

//probably responsible for fetching the raw data from an endpoint called "activity_by_day". Does nothing with the data yet.
// in the function called in UserDashboard.js the callback function is activitiesArray
//When _getJSON is finished with fetching the data, it will execute this callback with the data it retreived.
Zeeguu_API.prototype.getUserActivityByDay = function (callback) {
  this._getJSON("activity_by_day", callback);
};
