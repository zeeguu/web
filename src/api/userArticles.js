import { Zeeguu_API } from './classDef'

// articles
Zeeguu_API.prototype.getUserArticles = function (callback) {
  this._get('user_articles/recommended', callback)
}

Zeeguu_API.prototype.getBookmarkedArticles = function (callback) {
  this._get('user_articles/starred_or_liked', callback)
}

Zeeguu_API.prototype.getCohortArticles = function (callback) {
  this._get('cohort_articles', callback)
}

Zeeguu_API.prototype.getArticleInfo = function (articleID, callback) {
  this._get(`user_article?article_id=${articleID}`, callback)
}

Zeeguu_API.prototype.setArticleInfo = function (articleInfo, callback) {
  this._post(
    `user_article`,
    `article_id=${articleInfo.id}` +
      `&starred=${articleInfo.starred}` +
      `&liked=${articleInfo.liked}`,
    callback
  )
}

Zeeguu_API.prototype.setArticleOpened = function (articleID) {
  this._post('article_opened', `article_id=${articleID}`)
}
