import { Zeeguu_API } from "./classDef";
import qs from "qs";

//gets user commitment data and activites combined
Zeeguu_API.prototype.getUserActivityAndCommitment = function (callback) {
  this._getJSON("user_activity_and_commitment", callback);
};

//gets user commitment daa
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

//updates the user commitment when user reaches goal
Zeeguu_API.prototype.updateUserCommitment = function (
  last_commitment_update,
  commitment_and_activity_data,
  onSuccess,
) {
  const dataToSend = {
    last_commitment_update: last_commitment_update,
    commitment_and_activity_data: commitment_and_activity_data,
  };
  this.apiLog(this._appendSessionToUrl("user_commitment_update"));
  this._post(`user_commitment_update`, qs.stringify(dataToSend), onSuccess);
};
