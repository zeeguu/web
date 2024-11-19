import { Zeeguu_API } from "./classDef";

/*

This function could be responsible for fetching the raw data from an endpoint
called "data_user_commitment". Should do nothing with the data yet, other than
fetching the raw data. Later, this function could be called in the file UserDashboard.js, 
like api.getUserActivityByDay, where the callback function is activitiesArray.When _getJSON
is finished with fetching the data, it will execute this callback with the data it retreived.

*/
Zeeguu_API.prototype.getUserCommitment = function (callback) {
  this._getJSON("data_user_commitment", callback);
};

/*
_getJSON is a method defined for the Zeeguu_API class. When calling this. this probably refers
to the class Zeeguu_API .. I'm too tired to think more about this. To be continued :-)
*/
