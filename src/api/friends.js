import { Zeeguu_API } from "./classDef";


Zeeguu_API.prototype.getFriends = function(callback) {
  this._getJSON(`my_friends`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getFriendsOf = function(username, callback) {
  this._getJSON(`friends_of/${username}`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.getNumberOfReceivedFriendRequests = function(callback) {
  this._getJSON(`get_number_of_received_friend_requests`, (data) => {
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
  this._getJSON(`get_friend_details/${friend_username}`, (data) => {
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

Zeeguu_API.prototype.shareArticleWithFriend = function(friend_username, article_id, note) {
  return this.apiPost("/share_article_with_friend", { friend_username, article_id, note }, false);
}

Zeeguu_API.prototype.getArticlesSharedWithMe = function(callback) {
  this._getJSON(`articles_shared_with_me`, (data) => {
    callback(data);
  });
}

Zeeguu_API.prototype.markSharedArticleRead = function(shared_article_id) {
  return this.apiPost("/mark_shared_article_read", { shared_article_id }, false);
}

Zeeguu_API.prototype.dismissSharedArticle = function(shared_article_id) {
  return this.apiPost("/dismiss_shared_article", { shared_article_id }, false);
}
