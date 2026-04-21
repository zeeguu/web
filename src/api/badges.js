import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = function ({ onError } = {}) {
  return this._fetchJSON("/badges", { onError });
};

Zeeguu_API.prototype.getBadgesForFriend = function (username, { onError } = {}) {
  return this._fetchJSON(`/badges/${username}`, { onError });
};

Zeeguu_API.prototype.getNotShownUserBadges = function ({ onError } = {}) {
  return this._fetchJSON("/badges/count_not_shown", { onError });
};

Zeeguu_API.prototype.updateNotShownForUser = function (callback, onError) {
  this._post(`/badges/update_not_shown`, "", callback, onError);
};
