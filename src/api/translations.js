import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getOneTranslation = function (
  from_lang,
  to_lang,
  word,
  bookmark_token_i,
  context,
  context_token_i,
  sourceID,
  leftEllipsis,
  rightEllipsis,
  contextIdentifier,
) {
  let w_sent_i, w_token_i, w_total_tokens;
  let c_paragraph_i, c_sent_i, c_token_i;
  [w_sent_i, w_token_i, w_total_tokens] = bookmark_token_i;
  if (context_token_i) [c_paragraph_i, c_sent_i, c_token_i] = context_token_i;

  let payload = {
    word: word,
    context: context,
    source_id: sourceID,
    w_sent_i: w_sent_i,
    w_token_i: w_token_i,
    w_total_tokens: w_total_tokens,
    c_paragraph_i: c_paragraph_i,
    c_sent_i: c_sent_i,
    c_token_i: c_token_i,
    left_ellipsis: leftEllipsis,
    right_ellipsis: rightEllipsis,
    context_identifier: contextIdentifier,
  };

  return this.apiPost(`/get_one_translation/${from_lang}/${to_lang}`, payload);
};

Zeeguu_API.prototype.getMultipleTranslations = function (
  from_lang,
  to_lang,
  word,
  context,
  numberOfResults,
  serviceToExclude,
  translationToExclude,
  articleID,
) {
  let payload = {
    word: word,
    context: context,
    numberOfResults: numberOfResults,
    articleID: articleID,
  };
  if (serviceToExclude) {
    payload["service"] = serviceToExclude;
  }

  if (translationToExclude) {
    payload["currentTranslation"] = translationToExclude;
  }

  return this._post(
    `get_multiple_translations/${from_lang}/${to_lang}`,
    qs.stringify(payload),
  );
};

Zeeguu_API.prototype.contributeTranslation = function (
  from_lang,
  to_lang,
  word,
  translation,
  context,
  pageUrl,
  pageTitle,
) {
  /* Currently (13-01-2025), unused in the frontend */
  let payload = {
    word: word,
    translation: translation,
    context: context,
    url: pageUrl,
    pageTitle: pageTitle,
  };
  return this._post(
    `contribute_translation/${from_lang}/${to_lang}`,
    qs.stringify(payload),
  );
};

Zeeguu_API.prototype.updateBookmark = async function (
  bookmark_id,
  word,
  translation,
  context,
  context_identifier,
) {
  let payload = {
    word: word,
    translation: translation,
    context: context,
    context_identifier: context_identifier,
  };

  return await this.apiPost(`/update_bookmark/${bookmark_id}`, payload);
};

Zeeguu_API.prototype.basicTranlsate = function (from_lang, to_lang, phrase) {
  let url = this._appendSessionToUrl(`basic_translate/${from_lang}/${to_lang}`);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `phrase=${phrase}`,
  });
};
