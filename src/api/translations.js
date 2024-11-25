import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.getOneTranslation = function (
  from_lang,
  to_lang,
  word,
  context,
  articleUrl,
  articleTitle,
  articleID,
) {
  let payload = {
    word: word,
    context: context,
    url: articleUrl,
    title: articleTitle,
    articleID: articleID,
  };

  return this._post(
    `get_one_translation/${from_lang}/${to_lang}`,
    qs.stringify(payload),
  );
};

Zeeguu_API.prototype.getMultipleTranslations = function (
  from_lang,
  to_lang,
  word,
  context,
  pageUrl,
  numberOfResults,
  serviceToExclude,
  translationToExclude,
  articleID,
) {
  let url = this._appendSessionToUrl(
    `get_multiple_translations/${from_lang}/${to_lang}`,
  );

  let body = `word=${word}&context=${context}&url=${pageUrl}&numberOfResults=${numberOfResults}&articleID=${articleID}`;

  if (serviceToExclude) {
    body += `&service=${serviceToExclude}`;
  }

  if (translationToExclude) {
    body += `&currentTranslation=${translationToExclude}`;
  }

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });
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
  let url = this._appendSessionToUrl(
    `contribute_translation/${from_lang}/${to_lang}`,
  );

  let body = `word=${word}&translation=${translation}&context=${context}&url=${pageUrl}&pageTitle=${pageTitle}`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });
};

Zeeguu_API.prototype.updateBookmark = function (
  bookmark_id,
  word,
  translation,
  context,
) {
  let url = this._appendSessionToUrl(`update_bookmark/${bookmark_id}`);

  let body = `word=${word}&translation=${translation}&context=${context}`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });
};

Zeeguu_API.prototype.basicTranlsate = function (from_lang, to_lang, phrase) {
  let url = this._appendSessionToUrl(`basic_translate/${from_lang}/${to_lang}`);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `phrase=${phrase}`,
  });
};
