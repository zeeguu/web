import { Zeeguu_API } from "./classDef";

// Account-less reading of a shared article (PublicSharedArticlePage). None of
// these need a session; the share-link mint is the one exception, and it's
// called by the logged-in sharer.

Zeeguu_API.prototype.getPublicArticle = function (articleId, shareCode, callback, onError) {
  const query = shareCode ? `?s=${encodeURIComponent(shareCode)}` : "";
  this._getJSON(`public_article/${articleId}${query}`, callback, { onError });
};

Zeeguu_API.prototype.publicTranslateWord = function (fromLang, toLang, word, context, isSeparatedMwe, fullSentence) {
  return fetch(`${this.baseAPIurl}/public_translate_word/${fromLang}/${toLang}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word,
      context,
      is_separated_mwe: isSeparatedMwe,
      full_sentence_context: fullSentence,
    }),
  }).then((response) => {
    if (!response.ok) {
      const err = new Error(`HTTP ${response.status} on public_translate_word`);
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
  this._getJSON(
    `article_share_link_info/${encodeURIComponent(code)}?article_id=${articleId}`,
    callback,
    { onError: () => {} },
  );
};
