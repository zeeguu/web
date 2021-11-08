import { Zeeguu_API } from "./classDef";
import queryString from "query-string";

/*
  Example:
  
  api.joinCohort("zeeguu-beta"
    (cohort_name)=>{
        console.log(`joined cohort: ${cohort_name}`)
      })
*/

Zeeguu_API.prototype.joinCohort = function (inv_code, onSuccess, onError) {
  let payload = {
    invite_code: inv_code,
  };
  this._post("join_cohort", queryString.stringify(payload), onSuccess, onError);
};

//Using my id 2794 to not get an 401 Unauthorised erorr
Zeeguu_API.prototype.getStudent = function (callback) {
  this._getJSON(`/student_info`, callback);
};
