import { Zeeguu_API } from "./classDef";
import queryString from "query-string";
/**
 * Loads an invidiual user's data.
 * Requires permission (the logged in teacher must be a teacher of the class containing user with user_id ).
 * @param {integer} userId used to find user.
 * @param {integer} duration
 * @returns {object} object containing (id, name, email, reading time, exercises done, last article)
 */
Zeeguu_API.prototype.loadUserInfo = function (userID, duration, callback) {
  this._getJSON(`/user_info/${userID}/${duration}`, callback);
};

Zeeguu_API.prototype.getStudentInfo = function (studentID, cohortID, duration, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/user_info`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getReadingSessions = function (studentID, cohortID, duration, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_reading_sessions`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getExerciseHistory = function (studentID, duration, cohortID, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_exercise_history`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getLearnedWords = function (studentID, duration, cohortID, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_learned_words`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getNonStudiedWords = function (studentID, duration, cohortID, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_words_not_studied`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};

Zeeguu_API.prototype.getStudentActivityOverview = function (studentID, duration, cohortID, onSuccess, onError) {
  let payload = {
    student_id: studentID,
    number_of_days: duration,
    cohort_id: cohortID
  }
  this._post(`/student_activity_overview`,
    queryString.stringify(payload),
    onSuccess,
    onError,
    true
  );
};
