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

Zeeguu_API.prototype.setVideoOpened = function (videoID) {
  this._post("video_opened", `video_id=${videoID}`);
};

// **********
// TRANSLATED SUBTITLES (v1.5)
// **********
// Get the video info with translated captions swapped in. The server falls back to the
// original captions if `captionSetId` isn't `ready` yet, so the caller can use this freely
// during polling without bespoke error handling.
Zeeguu_API.prototype.getVideoInfoWithCaptionSet = function (videoID, captionSetId, callback) {
  this._getJSON(`user_video?video_id=${videoID}&caption_set_id=${captionSetId}`, callback);
};

// Kick off (or look up) a translated-caption set for this video in the learner's target
// language + CEFR. Idempotent server-side; a follow-up call for the same (video, lang, cefr)
// returns the same set without re-translating. Returns `{ id, status, ... }` — caller polls
// status until `ready`, then fetches via getVideoInfoWithCaptionSet().
Zeeguu_API.prototype.requestCaptionTranslation = function (
  videoID, targetLanguage, targetCefr, callback, onError,
) {
  this._postJSON(
    `video/${videoID}/translate_captions`,
    { target_language: targetLanguage, target_cefr: targetCefr },
    callback,
    onError,
  );
};

Zeeguu_API.prototype.pollCaptionTranslationStatus = function (videoID, setId, callback) {
  this._getJSON(`video/${videoID}/translate_captions/status?set_id=${setId}`, callback);
};