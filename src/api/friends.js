import { Zeeguu_API } from "./classDef";


Zeeguu_API.prototype.getFriends = function(callback) {
  this._getJSON(`get_friends`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getFriendsForUser = function(userId, callback) {
  this._getJSON(`get_friends/${userId}`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getReceivedFriendRequests = function(callback) {
  this._getJSON(`get_received_friend_requests`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.searchUsers = function(search_term, callback) {
  this._getJSON(`search_users?query=${encodeURIComponent(search_term)}`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getFriendDetails = function(friend_username, callback) {
  this._getJSON(`get_user_details/${friend_username}`, (data) => {
    callback(data);
  });
}

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