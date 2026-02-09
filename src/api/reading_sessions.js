import { Zeeguu_API } from "./classDef";
import qs from "qs";
import { getPlatform } from "../utils/misc/browserDetection";

Zeeguu_API.prototype.readingSessionCreate = function (articleId, readingSource, callback) {
  // the API expects the article_id to be an integer
  // readingSource: 'extension' or 'web'
  const after_extracting_json = function (json) {
    let id = JSON.parse(json).id;
    callback(id);
  };

  this._post(
    `reading_session_start`,
    qs.stringify({ article_id: articleId, reading_source: readingSource, platform: getPlatform() }),
    after_extracting_json
  );
};

Zeeguu_API.prototype.readingSessionUpdate = function (
  readingSessionId,
  currentDuration
) {
  let payload = {
    id: readingSessionId,
    duration: currentDuration * 1000, //the API expects ms
  };

  // Use beacon to prevent "Load failed" errors when user navigates away
  this._postBeacon(`reading_session_update`, qs.stringify(payload));
};

Zeeguu_API.prototype.readingSessionEnd = function (
  readingSessionId,
  totalTime
) {
  let payload = {
    id: readingSessionId,
    duration: totalTime * 1000,
  };

  // Use beacon to prevent "Load failed" errors when user navigates away
  this._postBeacon(`reading_session_end`, qs.stringify(payload));
};
