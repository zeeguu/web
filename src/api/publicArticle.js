import { Zeeguu_API } from "./classDef";

// Account-less reading of a shared article (PublicSharedArticlePage). None of
// these need a session; the share-link mint is the one exception, and it's
// called by the logged-in sharer.

// Plain fetch rather than _getJSON: a 404 here is an expected answer (a
// non-public article, a code whose sharer deleted their account), and
// _getJSON reports every non-2xx to Sentry.
function getExpectingNotFound(url, callback, onError) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(callback)
    .catch((e) => onError && onError(e));
}

Zeeguu_API.prototype.getPublicArticle = function (articleId, shareCode, callback, onError) {
  const query = shareCode ? `?s=${encodeURIComponent(shareCode)}` : "";
  getExpectingNotFound(`${this.baseAPIurl}/public_article/${articleId}${query}`, callback, onError);
};

// position: { part, paragraph_i, sent_i, token_i, total_tokens, partner_token_i, s }
// — where the word sits in the article; the server reads the word itself.
Zeeguu_API.prototype.publicTranslateWord = function (articleId, toLang, position) {
  return fetch(`${this.baseAPIurl}/public_translate/${articleId}/${toLang}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(position),
  }).then((response) => {
    if (!response.ok) {
      const err = new Error(`HTTP ${response.status} on public_translate`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  });
};

// The sharer's opaque code for this article, appended to copied links as &s=
// so recipients see who sent it.
Zeeguu_API.prototype.getArticleShareCode = function (articleId) {
  return fetch(this._appendSessionToUrl(`article_share_link/${articleId}`), { method: "POST" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => data?.code || null);
};

Zeeguu_API.prototype.getArticleShareLinkInfo = function (code, articleId, callback) {
  getExpectingNotFound(
    `${this.baseAPIurl}/article_share_link_info/${encodeURIComponent(code)}?article_id=${articleId}`,
    callback,
    null,
  );
};
