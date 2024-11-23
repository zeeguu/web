import { Zeeguu_API } from "./classDef";

Zeeguu_API.protoype.getUserActivityAndCommitment = function (callback) {
  this._getJSON("user_activity_and_commitment", callback);
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

Zeeguu_API.prototype.updateUserCommitment= function (
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
