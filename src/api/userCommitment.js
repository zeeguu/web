import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.userCommitmentCreation = function (
    userMinutes,
    userDays,
  ) {
    let payload = {
      user_minutes: userMinutes,
      user_days: userDays,
    };
  
    this._post(`user_commitment_create`, qs.stringify(payload));
  };

Zeeguu_API.prototype.userCommitmentUpdate = function (
    consecutiveWeeks,
  ) {
    let payload = {
      consecutive_weeks: consecutiveWeeks,
    };
  
    this._post(`user_commitment_update`, qs.stringify(payload));
  };