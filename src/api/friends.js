import { Zeeguu_API } from "./classDef";


Zeeguu_API.prototype.getFriends = function(callback) {
  this._getJSON(`get_friends`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.searchNewFriends = function(username, callback) {
  this._getJSON(`discover_friends/${username}`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getFriendRequests = function(callback) {
  this._getJSON(`get_friend_requests`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getPendingFriendRequests = function(callback) {
  return this._getJSON("/get_pending_friend_requests" , (data) => {
    callback(data);
  } );
}


Zeeguu_API.prototype.sendFriendRequest = function(receiver_id) {
  return this.apiPost("/send_friend_request", { receiver_id }, false);
}

Zeeguu_API.prototype.deleteFriendRequest = function(receiver_id) {
  return this.apiPost("/delete_friend_request", { receiver_id }, false);
}

Zeeguu_API.prototype.acceptFriendRequest = function(sender_id) {
  return this.apiPost(`/accept_friend_request`, { sender_id }, false);
}

Zeeguu_API.prototype.rejectFriendRequest = function(sender_id) {
  return this.apiPost(`/reject_friend_request`, { sender_id }, false);
}
Zeeguu_API.prototype.unfriend = function(receiver_id) {
  return this.apiPost("/unfriend", { receiver_id }, false);
}