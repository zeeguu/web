import { Zeeguu_API } from "./classDef";
import qs from "qs";
import { getPlatform } from "../utils/misc/browserDetection";

Zeeguu_API.prototype.listeningSessionCreate = function (lessonId, callback) {
  const after_extracting_json = function (json) {
    let id = JSON.parse(json).id;
    callback(id);
  };

  this._post(
    `listening_session_start`,
    qs.stringify({ lesson_id: lessonId, platform: getPlatform() }),
    after_extracting_json
  );
};

Zeeguu_API.prototype.listeningSessionUpdate = function (
  listeningSessionId,
  currentDuration
) {
  let payload = {
    id: listeningSessionId,
    duration: currentDuration * 1000, // the API expects ms
  };

  // Use beacon to prevent "Load failed" errors when user navigates away
  this._postBeacon(`listening_session_update`, qs.stringify(payload));
};

Zeeguu_API.prototype.listeningSessionEnd = function (
  listeningSessionId,
  totalTime
) {
  let payload = {
    id: listeningSessionId,
    duration: totalTime * 1000,
  };

  // Use beacon to prevent "Load failed" errors when user navigates away
  this._postBeacon(`listening_session_end`, qs.stringify(payload));
};
