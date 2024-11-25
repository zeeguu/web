import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserActivityAndCommitment = function (callback) {
  this._getJSON("user_activity_and_commitment", callback);
};

Zeeguu_API.prototype.getUserCommitment = function (callback) {
  this._getJSON("user_commitment", callback);
};

Zeeguu_API.prototype.createUserCommitment = function (
  userMinutes,
  userDays,
  callback,
) {
  let payload = {
    user_minutes: userMinutes,
    user_days: userDays,
  };

  this._postJSON("user_commitment_create", payload, callback);
};

Zeeguu_API.prototype.updateUserCommitment = function (
  consecutiveWeeks,
  commitmentLastUpdated,
  callback,
) {
  let payload = {
    consecutive_weeks: consecutiveWeeks,
    commitment_last_updated: commitmentLastUpdated,
  };

  this._putJSON("user_commitment_update", payload, callback);
};

//saves new commitment from user when user changes it under settings
Zeeguu_API.prototype.saveUserCommitmentInfo = function (
  user_commitment,
  onSuccess,
) {
  this.apiLog(this._appendSessionToUrl("user_commitment_info"));

  this._post(`user_commitment_info`, qs.stringify(user_commitment), onSuccess);
};
