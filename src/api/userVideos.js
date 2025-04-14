import { Zeeguu_API } from "./classDef";
import qs from "qs";

// **********
// GET VIDEO INFO
// **********
Zeeguu_API.prototype.getVideoInfo = function (videoID, callback) {
  this._getJSON(`user_video?video_id=${videoID}`, callback);
};

// **********
// UPDATE PLAYBACK POSITION
// **********
Zeeguu_API.prototype.updatePlaybackPosition = function (videoID, positionInSeconds) {
  const onSuccess = () => {
    console.log("Playback position updated");
  };

  const onError = (error) => {
    console.error(error);
  };

  const body = {
    video_id: videoID,
    playback_position: positionInSeconds ? Math.round(positionInSeconds * 1000) : 0,
  };

  this._post(`video_set_playback`, qs.stringify(body), onSuccess, onError);
};
