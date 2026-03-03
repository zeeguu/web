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

Zeeguu_API.prototype.sendFriendRequest = function(receiver_id, onSuccess, onError) {
  this.apiPost("send_friend_request", { receiver_id }, false).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      response.json().then((json) => {
        onError(json.message);
      });
    }
  });
}

Zeeguu_API.prototype.deleteFriendRequest = function(receiver_id, onSuccess, onError) {
  this.apiPost("delete_friend_request", { receiver_id }, false).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      response.json().then((json) => {
        onError(json.message);
      });
    }
  });
}

Zeeguu_API.prototype.acceptFriendRequest = function(sender_id, onSuccess, onError) {
  this.apiPost(`/accept_friend_request`, { sender_id }, false).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      response.json().then((json) => {
        onError(json.message);
      });
    }
  });
}

Zeeguu_API.prototype.rejectFriendRequest = function(sender_id, onSuccess, onError) {
  this.apiPost(`/reject_friend_request`, { sender_id }, false).then((response) => {
    if (response.ok) {
      onSuccess();
    } else {
      response.json().then((json) => {
        onError(json.message);
      });
    }
  });
}

Zeeguu_API.prototype.unfriend = function(receiver_id) {
  return this.apiPost("/unfriend", { receiver_id }, false);
}