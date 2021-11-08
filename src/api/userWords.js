import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getBookmarksByDay = function (callback) {
  this._getJSON("bookmarks_by_day/with_context", callback);
};

Zeeguu_API.prototype.getBookmarksCountsByDate = function (callback) {
  this._getJSON("bookmark_counts_by_date", callback);
};

Zeeguu_API.prototype.starredBookmarks = function (count, callback) {
  this._getJSON(`starred_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.learnedBookmarks = function (count, callback) {
  this._getJSON(`learned_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.topBookmarks = function (count, callback) {
  this._getJSON(`top_bookmarks/${count}`, callback);
};

Zeeguu_API.prototype.bookmarksForArticle = function (articleId, callback) {
  this._getJSON(`bookmarks_for_article/${articleId}`, (result) =>
    callback(result.bookmarks)
  );
};

Zeeguu_API.prototype.bookmarksToStudyForArticle = function (
  articleId,
  callback
) {
  this._getJSON(`bookmarks_to_study_for_article/${articleId}`, (result) =>
    callback(result.bookmarks)
  );
};

// individual bookmark handling

Zeeguu_API.prototype.unstarBookmark = function (bookmark_id) {
  this._post(`unstar_bookmark/${bookmark_id}`);
};

Zeeguu_API.prototype.starBookmark = function (bookmark_id) {
  this._post(`star_bookmark/${bookmark_id}`);
};

Zeeguu_API.prototype.deleteBookmark = function (bookmark_id, callback) {
  this._post(`delete_bookmark/${bookmark_id}`, "", callback);
};
