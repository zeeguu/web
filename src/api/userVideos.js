import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getVideoInfo = function (videoID, callback) {
    this._getJSON(`user_video?video_id=${videoID}`, callback);
};