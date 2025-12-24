import { Zeeguu_API } from "./classDef";
import qs from "qs";

// Consistent naming with other session types (reading, browsing, listening)
Zeeguu_API.prototype.exerciseSessionCreate = function (callback) {
  const after_extracting_json = function (json) {
    let id = JSON.parse(json).id;
    callback(id);
  };
  this._post(`exercise_session_start`, null, after_extracting_json);
};

Zeeguu_API.prototype.exerciseSessionUpdate = function (
  exerciseSessionId,
  currentDuration
) {
  let payload = {
    id: exerciseSessionId,
    duration: currentDuration * 1000, // the API expects ms
  };

  this._post(`exercise_session_update`, qs.stringify(payload));
};

Zeeguu_API.prototype.exerciseSessionEnd = function (
  exerciseSessionId,
  totalTime
) {
  let payload = {
    id: exerciseSessionId,
    duration: totalTime * 1000,
  };

  this._post(`exercise_session_end`, qs.stringify(payload));
};

// Backwards compatibility aliases (can be removed once all usages are migrated)
Zeeguu_API.prototype.startLoggingExerciseSessionToDB = function (callback) {
  this._post(`exercise_session_start`, null, callback);
};

Zeeguu_API.prototype.updateExerciseSession = function (sessionId, duration) {
  this.exerciseSessionUpdate(sessionId, duration);
};

Zeeguu_API.prototype.reportExerciseSessionEnd = function (sessionId, totalTime) {
  this.exerciseSessionEnd(sessionId, totalTime);
};
