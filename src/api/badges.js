import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBadgesForUser = function(userId, callback) {
  
  this._getJSON(`badges/${userId}`, callback);
};

Zeeguu_API.prototype.getBadgesForUserAsync = function(userId) {
  return new Promise((resolve, reject) => {
    this.getBadgesForUser(userId, (data) => {
      resolve(data);
    });
  });
};
