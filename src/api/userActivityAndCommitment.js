import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserActivityAndCommitment = function (callback) {
  this._getJSON("user_activity_and_commitment", callback);
};

Zeeguu_API.prototype.getUserCommitment = function (callback) {
  this._getJSON("user_commitment", callback);
};

//creates the user commitment upon registration
Zeeguu_API.prototype.createUserCommitment = function (
  user_commitment,
  onSuccess,
) {
  this.apiLog(this._appendSessionToUrl("user_commitment_create"));
  this._post(
    `user_commitment_create`,
    qs.stringify(user_commitment),
    onSuccess,
  );
};

//updates commitment values when user changes it under settings
Zeeguu_API.prototype.saveUserCommitmentInfo = function (
  user_commitment,
  onSuccess,
) {
  this.apiLog(this._appendSessionToUrl("user_commitment_info"));

  this._post(`user_commitment_info`, qs.stringify(user_commitment), onSuccess);
};
