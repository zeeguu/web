import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = function(userId, callback) {
  this._getJSON(`/badges/${userId}`, callback);
};

Zeeguu_API.prototype.updateBadgeLevelShown= function(badge_level_id, callback) {
  this._getJSON(`/badges/${badge_level_id}/set_is_shown`, callback);
};

Zeeguu_API.prototype.getNotShownUserBadges = function (callback) {
  this._getJSON(`/badges/count_not_shown_badges`, callback);
};

Zeeguu_API.prototype.getBadgesForUserAsync = function(userId) {
  return new Promise((resolve, reject) => {
    this.getBadgesForUser(userId, (data) => {
      resolve(data);
    });
  });
};
