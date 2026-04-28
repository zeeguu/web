import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getMyBadges = function(callback, onError) {
  this._getJSON(`/my_badges`, callback, { onError });
};

Zeeguu_API.prototype.getFriendBadges = function(username, callback, onError) {
  this._getJSON(`/friend_badges/${username}`, callback, { onError });
};

Zeeguu_API.prototype.getUnseenBadgeCount = function (callback) {
  this._getJSON(`/badges/count_unseen`, callback);
};

Zeeguu_API.prototype.markAllBadgesSeen = function (callback, onError) {
  this._post(`/badges/mark_all_seen`, "", callback, onError);
};
