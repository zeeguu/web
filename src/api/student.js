import { Zeeguu_API } from "./classDef";
import qs from "qs";

/*
  Given an invite code (string), this function will try to join the cohort 
  that is represented by that invite code.
  
  api.joinCohort("zeeguu-beta"
    (cohort_name)=>{
        console.log(`joined cohort: ${cohort_name}`)
      })
*/

Zeeguu_API.prototype.joinCohort = function (inv_code, onSuccess, onError) {
  let payload = {
    invite_code: inv_code,
  };
  this._post("join_cohort", qs.stringify(payload), onSuccess, onError);
};

Zeeguu_API.prototype.leaveCohort = function (cohortID, callback) {
  this._getPlainText(`leave_cohort/${cohortID}`, callback);
};

/*
  Gets info about this student, including the cohort he is in.
  Endpoint implementation:  https://github.com/zeeguu/api/blob/master/zeeguu/api/api/student.py
  */

Zeeguu_API.prototype.getStudent = function (callback) {
  this._getJSON(`/student_info`, callback);
};
