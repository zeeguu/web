import { Zeeguu_API } from "./classDef";
import qs from "qs";
import { getPlatform } from "../utils/misc/browserDetection";

// **********
// CREATE WATCHING SESSION
// **********
Zeeguu_API.prototype.createWatchingSession = function (videoId, callback) {
  const onSuccess = function (json) {
    console.log("Watching session created:", json);
    const video_id = JSON.parse(json).id;
    callback(video_id);
  };

  this._post(
    `watching_session_start`,
    qs.stringify({ video_id: videoId, platform: getPlatform() }),
    onSuccess,
    (error) => {
      console.error(error);
    }
  );
};

// **********
// UPDATE WATCHING SESSION
// **********
Zeeguu_API.prototype.updateWatchingSession = function (watchingSessionId, currentDurationInSeconds) {
  let payload = {
    id: watchingSessionId,
    duration: currentDurationInSeconds * 1000, //the API expects ms
  };

  this._post(
    `watching_session_update`,
    qs.stringify(payload),
    () => {
      console.log("Watching session updated");
    },
    (error) => {
      console.error(error);
    },
  );
};
