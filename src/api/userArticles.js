import { Zeeguu_API } from "./classDef";
import qs from "qs";

// articles
// articles

/**
 * Get recommended articles for the user
 *
 * @param {Function} callback - Function to call with the articles
 * @param {Object} options - Optional parameters
 * @param {boolean} options.excludeSaved - If true, exclude articles the user has saved
 *
 * Note: Hidden articles are always excluded from recommendations.
 *
 * Usage examples:
 *   // Get all recommended articles (backward compatible)
 *   api.getUserArticles(callback);
 *
 *   // Exclude saved articles
 *   api.getUserArticles(callback, { excludeSaved: true });
 */
Zeeguu_API.prototype.getUserArticles = function (callback, options = {}) {
  // Build query string for optional exclusion parameters
  const params = [];
  if (options.excludeSaved) {
    params.push("exclude_saved=true");
  }
  const queryString = params.length > 0 ? "?" + params.join("&") : "";

  this._getJSON("user_articles/recommended" + queryString, (articles) => {
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

/**
 * Get more recommended articles with pagination
 *
 * @param {number} count - Number of articles to retrieve
 * @param {number} page - Page number (for pagination)
 * @param {Function} callback - Function to call with the articles
 * @param {Object} options - Optional parameters
 * @param {boolean} options.excludeSaved - If true, exclude articles the user has saved
 *
 * Note: Hidden articles are always excluded from recommendations.
 *
 * Usage examples:
 *   // Get 20 articles from page 1 without exclusions (backward compatible)
 *   api.getMoreUserArticles(20, 1, callback);
 *
 *   // Get 20 articles from page 2, excluding saved articles
 *   api.getMoreUserArticles(20, 2, callback, { excludeSaved: true });
 */
Zeeguu_API.prototype.getMoreUserArticles = function (count, page, callback, options = {}) {
  // Build query string for optional exclusion parameters
  const params = [];
  if (options.excludeSaved) {
    params.push("exclude_saved=true");
  }
  const queryString = params.length > 0 ? "?" + params.join("&") : "";

  this._getJSON(
    "user_articles/recommended/" + count + "/" + page + queryString,
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

Zeeguu_API.prototype.getSavedUserArticles = function (page, callback) {
  this._getJSON(`user_articles/saved/${page}`, (articles) => {
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

/**
 * Get article info with streaming progress updates via SSE
 *
 * @param {string} articleID - The article ID
 * @param {Function} onProgress - Callback for progress updates: {message, step, total}
 * @param {Function} onComplete - Callback when article data is ready
 * @param {Function} onError - Callback for errors
 */
Zeeguu_API.prototype.getArticleInfoWithProgress = function (articleID, onProgress, onComplete, onError) {
  const url = this._appendSessionToUrl(`user_article_stream?article_id=${articleID}`);

  const eventSource = new EventSource(url);

  eventSource.addEventListener('progress', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onProgress) {
        onProgress(data);
      }
    } catch (e) {
      console.error('Failed to parse progress event:', e);
    }
  });

  eventSource.addEventListener('complete', (event) => {
    try {
      const data = JSON.parse(event.data);
      eventSource.close();
      if (onComplete) {
        onComplete(data);
      }
    } catch (e) {
      console.error('Failed to parse complete event:', e);
      eventSource.close();
      if (onError) {
        onError('Failed to parse article data');
      }
    }
  });

  eventSource.addEventListener('error', (event) => {
    // Check if it's an SSE error event with data
    if (event.data) {
      try {
        const data = JSON.parse(event.data);
        eventSource.close();
        if (onError) {
          onError(data.error || 'Unknown error');
        }
      } catch (e) {
        eventSource.close();
        if (onError) {
          onError('Stream error');
        }
      }
    } else {
      // Connection error - fall back to regular API
      eventSource.close();
      console.log('SSE connection failed, falling back to regular API');
      this.getArticleInfo(articleID, onComplete);
    }
  });

  // Return a function to close the connection if needed
  return () => eventSource.close();
};

Zeeguu_API.prototype.getArticleSummaryInfo = function (articleID, callback) {
  this._getJSON(`user_article_summary?article_id=${articleID}`, callback);
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

Zeeguu_API.prototype.findOrCreateArticle = function (articleInfo, callback, onError) {
  // Pass all fields from articleInfo to backend
  // If preExtracted is true, the extension has already done all extraction work
  let article = {
    url: articleInfo.url,
    htmlContent: articleInfo.htmlContent,
    textContent: articleInfo.textContent,
    title: articleInfo.title,
    author: articleInfo.author,
    excerpt: articleInfo.excerpt,
    siteName: articleInfo.siteName,
    imageUrl: articleInfo.imageUrl,
    preExtracted: articleInfo.preExtracted,
  };
  this._post(`/find_or_create_article`, qs.stringify(article), callback, onError);
};

Zeeguu_API.prototype.removeMLSuggestion = function (
  articleId,
  topic,
  callback,
) {
  let param = qs.stringify({ article_id: articleId, topic: topic });
  this._post(`/remove_ml_suggestion`, param, callback);
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

Zeeguu_API.prototype.detectArticleLanguage = function (
  htmlContent,
  callback,
  onError,
) {
  let article = { htmlContent: htmlContent, detailed: true };
  this._post(
    `/is_article_language_supported`,
    qs.stringify(article),
    (response) => {
      try {
        callback(JSON.parse(response));
      } catch (e) {
        // Backward compatibility - old format
        callback({ supported: response === "YES" });
      }
    },
    (error) => {
      // Handle HTTP errors (401, 406, 500, etc.)
      console.error("Language detection failed:", error);
      if (onError) {
        onError(error);
      } else {
        // Default fallback - treat as unsupported
        callback({ supported: false, error: error.message });
      }
    }
  );
};

Zeeguu_API.prototype.translateAndAdaptArticle = function (
  url,
  targetLanguage,
  callback,
  onError,
) {
  let params = { url: url };
  if (targetLanguage) {
    params.target_language = targetLanguage;
  }
  this._post(`/translate_and_adapt_article`, qs.stringify(params), (response) => {
    try {
      callback(JSON.parse(response));
    } catch (e) {
      if (onError) {
        onError("Failed to parse translation response");
      }
    }
  }, onError);
};

Zeeguu_API.prototype.getLearnedLanguage = function (callback, onError) {
  this._getPlainText(`learned_language`, callback, onError);
};

Zeeguu_API.prototype.sendFeedback = function (feedback, callback, onError) {
  this._post(`/send_feedback`, qs.stringify(feedback), callback, onError);
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

Zeeguu_API.prototype.getArticleSimplificationLevels = function (articleID, callback) {
  this._getJSON(`article_simplification_levels?article_id=${articleID}`, callback);
};

Zeeguu_API.prototype.simplifyArticle = function (articleID, callback) {
  const url = this._appendSessionToUrl(`simplify_article/${articleID}`);
  
  // Use AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout
  
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "",
    signal: controller.signal
  })
  .then((response) => {
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.text();
  })
  .then((response) => {
    try {
      callback(JSON.parse(response));
    } catch (e) {
      callback({ status: "error", message: "Invalid response format" });
    }
  })
  .catch((error) => {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      // Check if simplification actually succeeded despite timeout
      setTimeout(() => {
        this.getArticleSimplificationLevels(articleID, (levels) => {
          if (levels && levels.length > 1) {
            // Simplification succeeded despite timeout
            callback({ status: "success", levels: levels });
          } else {
            callback({ status: "error", message: "Simplification timed out" });
          }
        });
      }, 2000); // Wait 2 seconds then check
    } else {
      callback({ status: "error", message: error.message || "Network error" });
    }
  });
};

Zeeguu_API.prototype.hideArticle = function (articleId, callback) {
  let param = qs.stringify({ article_id: articleId });
  this._post(`/hide_article`, param, callback);
};

Zeeguu_API.prototype.unhideArticle = function (articleId, callback) {
  let param = qs.stringify({ article_id: articleId, hidden: "false" });
  this._post(`/hide_article`, param, callback);
};

Zeeguu_API.prototype.getHiddenUserArticles = function (page, callback) {
  this._getJSON(`user_articles/hidden/${page}`, (articles) => {
    const ids = articles.map((o) => o.id);
    const deduplicated = articles.filter(
      ({ id }, index) => !ids.includes(id, index + 1),
    );
    callback(deduplicated);
  });
};

Zeeguu_API.prototype.reportBrokenArticle = function (articleId, reason, callback, onError) {
  let param = qs.stringify({ article_id: articleId, reason: reason });
  this._post(`/report_broken_article`, param, (response) => {
    try {
      callback(JSON.parse(response));
    } catch (e) {
      if (onError) {
        onError("Failed to parse response");
      }
    }
  }, onError);
};

Zeeguu_API.prototype.clearArticleCache = function (articleId, callback, onError) {
  this._post(`/clear_article_cache/${articleId}`, "", (response) => {
    try {
      callback(JSON.parse(response));
    } catch (e) {
      if (onError) {
        onError("Failed to parse response");
      }
    }
  }, onError);
};
