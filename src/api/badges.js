import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = function(callback) {
  this._getJSON(`/badges`, callback);
};

Zeeguu_API.prototype.getNotShownUserBadges = function (callback) {
  this._getJSON(`/badges/count_not_shown`, callback);
};

Zeeguu_API.prototype.updateNotShownForUser = function (callback, onError) {
  this._post(`/badges/update_not_shown`, "", callback, onError);
};
