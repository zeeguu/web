import { Zeeguu_API } from "./classDef";
import qs from "qs";

// articles
// articles
Zeeguu_API.prototype.getUserArticles = function (callback) {
  this._getJSON("user_articles/recommended", (articles) => {
    // sometimes we get duplicates from the server
    // deduplicate them here
    // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
    const ids = articles.map((o) => o.id);
    const deduplicated = articles.filter(
      ({ id }, index) => !ids.includes(id, index + 1),
    );
    console.log(deduplicated);
    callback(deduplicated);
  });
};
Zeeguu_API.prototype.getMoreUserArticles = function (count, page, callback) {
  this._getJSON(
    "user_articles/recommended/" + count + "/" + page,
    (articles) => {
      // sometimes we get duplicates from the server
      // deduplicate them here
      // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
      const ids = articles.map((o) => o.id);
      const deduplicated = articles.filter(
        ({ id }, index) => !ids.includes(id, index + 1),
      );
      console.log(deduplicated);
      callback(deduplicated);
    },
  );
};

Zeeguu_API.prototype.getRecommendedArticles = function (callback) {
  this._getJSON("user_articles/foryou", (articles) => {
    const ids = articles.map((o) => o.id);
    const deduplicated = articles.filter(
      ({ id }, index) => !ids.includes(id, index + 1),
    );
    callback(deduplicated);
  });
};

Zeeguu_API.prototype.getSavedUserArticles = function (callback) {
  this._getJSON("user_articles/saved", (articles) => {
    // sometimes we get duplicates from the server
    // deduplicate them here
    // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
    const ids = articles.map((o) => o.id);
    const deduplicated = articles.filter(
      ({ id }, index) => !ids.includes(id, index + 1),
    );
    callback(deduplicated);
  });
};

Zeeguu_API.prototype.search = function (
  term,
  searchPublishPriority,
  searchDifficultyPriority,
  callback,
  onError,
) {
  let preferences = {
    use_publish_priority: searchPublishPriority,
    use_readability_priority: searchDifficultyPriority,
  };
  return this._post(
    `search/${term}`,
    qs.stringify(preferences),
    (response) => {
      let articles = JSON.parse(response);
      // sometimes we get duplicates from the server
      // deduplicate them here
      // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
      const ids = articles.map((o) => o.id);
      const deduplicated = articles.filter(
        ({ id }, index) => !ids.includes(id, index + 1),
      );
      callback(deduplicated);
    },
    onError,
  );
};

Zeeguu_API.prototype.latestSearch = function (term, callback) {
  return this._getJSON(`latest_search/${term}`, (articles) => {
    // sometimes we get duplicates from the server
    // deduplicate them here
    // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
    const ids = articles.map((o) => o.id);
    const deduplicated = articles.filter(
      ({ id }, index) => !ids.includes(id, index + 1),
    );
    callback(deduplicated);
  });
};

Zeeguu_API.prototype.searchMore = function (
  term,
  page,
  searchPublishPriority,
  searchDifficultyPriority,
  callback,
  onError,
) {
  let preferences = {
    use_publish_priority: searchPublishPriority,
    use_readability_priority: searchDifficultyPriority,
  };
  return this._post(
    `search/${term}/${page}`,
    qs.stringify(preferences),
    (response) => {
      let articles = JSON.parse(response);
      // sometimes we get duplicates from the server
      // deduplicate them here
      // fast deduplication cf. https://stackoverflow.com/a/64791605/1200070
      const ids = articles.map((o) => o.id);
      const deduplicated = articles.filter(
        ({ id }, index) => !ids.includes(id, index + 1),
      );
      callback(deduplicated);
    },
    onError,
  );
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
    callback,
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
    authors: articleInfo.authors,
  };
  this._post(`/find_or_create_article`, qs.stringify(article), callback);
};

Zeeguu_API.prototype.makePersonalCopy = function (articleId, callback) {
  let param = qs.stringify({ article_id: articleId });
  this._post(`/make_personal_copy`, param, callback);
};

Zeeguu_API.prototype.removePersonalCopy = function (articleId, callback) {
  let param = qs.stringify({ article_id: articleId });
  this._post(`/remove_personal_copy`, param, callback);
};

Zeeguu_API.prototype.isArticleLanguageSupported = function (
  htmlContent,
  callback,
) {
  let article = { htmlContent: htmlContent };
  this._post(`/is_article_language_supported`, qs.stringify(article), callback);
};

Zeeguu_API.prototype.sendFeedback = function (feedback, callback) {
  this._post(`/send_feedback`, qs.stringify(feedback), callback);
};

Zeeguu_API.prototype.submitArticleDifficultyFeedback = function (
  feedback,
  callback,
) {
  this._post(`/article_difficulty_feedback`, qs.stringify(feedback), callback);
};

Zeeguu_API.prototype.getUnfinishedUserReadingSessions = function (callback) {
  this._getJSON(`/get_unfinished_user_reading_sessions`, callback);
};
