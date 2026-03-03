import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = function(callback) {
  this._getJSON(`/get_user_badges`, callback);
};

Zeeguu_API.prototype.getNotShownUserBadges = function (callback) {
  this._getJSON(`/count_not_shown_badges`, callback);
};
