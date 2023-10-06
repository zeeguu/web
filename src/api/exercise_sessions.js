import {Zeeguu_API} from "./classDef";
import qs from "qs";


Zeeguu_API.prototype.startExerciseSession = function (callback) {

    this._post(`start_new_exercise_session`, null, callback);
};

Zeeguu_API.prototype.updateExerciseSession = function (currentSessionId, currentDuration) {

    let payload = {
        id: currentSessionId,
        duration: currentDuration * 1000 //the API expects ms
    };

    this._post(`update_exercise_session`, qs.stringify(payload));
};
