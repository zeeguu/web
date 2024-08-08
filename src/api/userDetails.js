import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getUserDetails = function (callback) {
  this._getJSON("get_user_details", callback);
};

Zeeguu_API.prototype.saveUserDetails = function (
  user_details,
  setErrorMessage,
  onSuccess,
) {
  this.apiLog(this._appendSessionToUrl("user_settings"));

  this._post(
    `user_settings`,
    qs.stringify(user_details),
    onSuccess,
    setErrorMessage,
  );
};

Zeeguu_API.prototype.modifyCEFRlevel = function (
  languageID,
  cefrLevel,
  onSuccess,
  onError,
) {
  let payload = {
    language_id: languageID,
    language_level: cefrLevel,
  };
  this._post(
    `user_languages/modify`,
    qs.stringify(payload),
    onSuccess,
    onError,
  );
};

// Topics that can be subscribed to
Zeeguu_API.prototype.getUserPreferences = function (callback) {
  this._getJSON("user_preferences", callback);
};

Zeeguu_API.prototype.saveUserPreferences = function (
  preferences,
  onSuccess,
  onError,
) {
  this._post(
    `save_user_preferences`,
    qs.stringify(preferences),
    onSuccess,
    onError,
  );
};
