import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getFriends = function ({ onError } = {}) {
  return this._fetchJSON("get_friends", { onError });
};

Zeeguu_API.prototype.getFriendsForUser = function (username, { onError } = {}) {
  return this._fetchJSON(`get_friends/${username}`, { onError });
};

Zeeguu_API.prototype.getNumberOfReceivedFriendRequests = function ({ onError } = {}) {
  return this._fetchJSON("get_number_of_received_friend_requests", { onError });
};

Zeeguu_API.prototype.getReceivedFriendRequests = function ({ onError } = {}) {
  return this._fetchJSON("get_received_friend_requests", { onError });
};

Zeeguu_API.prototype.searchUsers = function (search_term, { onError } = {}) {
  return this._fetchJSON(`search_users?query=${encodeURIComponent(search_term)}`, { onError });
};

Zeeguu_API.prototype.getFriendDetails = function (friend_username, { onError } = {}) {
  return this._fetchJSON(`get_user_details/${friend_username}`, { onError });
};

Zeeguu_API.prototype.sendFriendRequest = function(receiver_username) {
  return this.apiPost("/send_friend_request", { receiver_username }, false);
}

Zeeguu_API.prototype.deleteFriendRequest = function(receiver_username) {
  return this.apiPost("/delete_friend_request", { receiver_username }, false);
}

Zeeguu_API.prototype.acceptFriendRequest = function(sender_username) {
  return this.apiPost(`/accept_friend_request`, { sender_username }, false);
}

Zeeguu_API.prototype.rejectFriendRequest = function(sender_username) {
  return this.apiPost(`/reject_friend_request`, { sender_username }, false);
}
Zeeguu_API.prototype.unfriend = function(receiver_username) {
  return this.apiPost("/unfriend", { receiver_username }, false);
}