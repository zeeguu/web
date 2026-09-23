import { Zeeguu_API } from "./classDef";

// Article links: zeeguu.org/read/<article code>.<sharer code>. A logged-in
// reader's address bar shows their own link and the Share button copies the
// same one; the public page (no account) opens articles only through links.

// Plain fetch rather than _getJSON: a 404 here is an expected answer (an
// unknown link), and _getJSON reports every non-2xx to Sentry.
function getExpectingNotFound(url, callback, onError) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(callback)
    .catch((e) => onError && onError(e));
}

// The caller's link to an article ("<article code>.<sharer code>"). Written
// once per article and once per user on the server, so asking on every open
// is cheap.
Zeeguu_API.prototype.getArticleLink = function (articleId) {
  return fetch(this._appendSessionToUrl(`article_link/${articleId}`), { method: "POST" })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => data?.link || null);
};

// { article_id, shared_by_name } for a link.
Zeeguu_API.prototype.getArticleLinkInfo = function (link, callback, onError) {
  getExpectingNotFound(`${this.baseAPIurl}/article_link_info/${encodeURIComponent(link)}`, callback, onError);
};

// Links handed out on 2026-09-23 looked like /read/article?id=<id>&s=<code>;
// this gives today's { link } for one.
Zeeguu_API.prototype.resolveLegacyShareLink = function (code, articleId, callback, onError) {
  getExpectingNotFound(
    `${this.baseAPIurl}/article_share_link_info/${encodeURIComponent(code)}?article_id=${encodeURIComponent(articleId)}`,
    callback,
    onError,
  );
};

Zeeguu_API.prototype.getPublicArticle = function (link, callback, onError) {
  getExpectingNotFound(`${this.baseAPIurl}/public_article/${encodeURIComponent(link)}`, callback, onError);
};

// position: { part, paragraph_i, sent_i, token_i, total_tokens, partner_token_i }
// — where the word sits in the article; the server reads the word itself.
Zeeguu_API.prototype.publicTranslateWord = function (link, toLang, position) {
  return fetch(`${this.baseAPIurl}/public_translate/${encodeURIComponent(link)}/${toLang}`, {
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
