import { Zeeguu_API } from "./classDef";

//Plugging teacher-related functions into the Zeeguu_API class

Zeeguu_API.prototype.isTeacher = function (callback) {
  this._get(`is_teacher`, callback);
};

Zeeguu_API.prototype.createCohort = function (data) {
  return apiPost("/create_own_cohort", data, true);
};

//TODO Remove... Implemented it directly in classDef.js instead
/* Zeeguu_API.prototype.getCohortsInfo = function(){
  return apiGet('/cohorts_info');
} */