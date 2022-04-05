import { Zeeguu_API } from "./classDef";
import qs from "qs";

// articles
Zeeguu_API.prototype.getUserArticles = function (callback) {
  this._getJSON("user_articles/recommended", callback);
};

Zeeguu_API.prototype.getBookmarkedArticles = function (callback) {
  this._getJSON("user_articles/starred_or_liked", callback);
};

Zeeguu_API.prototype.getCohortArticles = function (callback) {
  this._getJSON("cohort_articles", callback);
};

Zeeguu_API.prototype.getArticleInfo = function (articleID, callback) {
  this._getJSON(`user_article?article_id=${articleID}`, callback);
};

Zeeguu_API.prototype.setArticleInfo = function (articleInfo, callback) {
  this._post(
    `user_article`,
    `article_id=${articleInfo.id}` +
      `&starred=${articleInfo.starred}` +
      `&liked=${articleInfo.liked}`,
    callback
  );
};

Zeeguu_API.prototype.setArticleOpened = function (articleID) {
  this._post("article_opened", `article_id=${articleID}`);
};

Zeeguu_API.prototype.findOrCreateArticle = function (articleInfo, callback) {
  let article = {
      url: articleInfo.url,
      htmlContent: articleInfo.htmlContent,
      title: articleInfo.title,
      authors: articleInfo.authors
    }
  this._post(`/find_or_create_article`,
  qs.stringify(article),
      callback
  );
}; 

Zeeguu_API.prototype.makePersonalCopy = function (articleId, callback) {
  this._post(`/make_personal_copy`,
  qs.stringify(articleId),
      callback
  );
};


Zeeguu_API.prototype.isArticleLanguageSupported = function (htmlContent, callback) {
  let article = {htmlContent: htmlContent}
  this._post(`/is_article_language_supported`,
  qs.stringify(article),
  callback
  );
};
