import { Zeeguu_API } from "./classDef";
import qs from "qs";
import { getPlatform } from "../utils/misc/browserDetection";

Zeeguu_API.prototype.browsingSessionCreate = function (callback) {
  const after_extracting_json = function (json) {
    let id = JSON.parse(json).id;
    callback(id);
  };

  this._post(
    `browsing_session_start`,
    qs.stringify({ platform: getPlatform() }),
    after_extracting_json
  );
};

Zeeguu_API.prototype.browsingSessionUpdate = function (
  browsingSessionId,
  currentDuration
) {
  let payload = {
    id: browsingSessionId,
    duration: currentDuration * 1000, // the API expects ms
  };

  this._post(`browsing_session_update`, qs.stringify(payload));
};

Zeeguu_API.prototype.browsingSessionEnd = function (
  browsingSessionId,
  totalTime
) {
  let payload = {
    id: browsingSessionId,
    duration: totalTime * 1000,
  };

  this._post(`browsing_session_end`, qs.stringify(payload));
};
