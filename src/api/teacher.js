import { Zeeguu_API } from "./classDef";

//Plugging teacher-related functions into the Zeeguu_API class

Zeeguu_API.prototype.isTeacher = function (callback) {
  this._get(`is_teacher`, callback);
};

Zeeguu_API.prototype.createCohort = function (data) {
  this.apiPost("/create_own_cohort", data, true);
};

Zeeguu_API.prototype.getCohortsInfo = function(callback){
  this._get("/cohorts_info", callback);
}
