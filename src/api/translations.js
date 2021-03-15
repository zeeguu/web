import { Zeeguu_API } from "./classDef";

Zeeguu_API.prototype.getPossibleTranslations = function (
  from_lang,
  to_lang,
  word,
  context,
  pageUrl
) {
  let url = this._appendSessionToUrl(
    `get_possible_translations/${from_lang}/${to_lang}`
  );

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `word=${word}&context=${context}&url=${pageUrl}`,
  });
};

Zeeguu_API.prototype.getOneTranslation = function (
  from_lang,
  to_lang,
  word,
  context,
  articleUrl,
  articleTitle
) {
  let url = this._appendSessionToUrl(
    `get_one_translation/${from_lang}/${to_lang}`
  );

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `word=${word}&context=${context}&url=${articleUrl}&title=${articleTitle}`,
  });
};

Zeeguu_API.prototype.getNextTranslations = function (
  from_lang,
  to_lang,
  word,
  context,
  pageUrl,
  numberOfResults,
  service,
  currentTranslation,
  articleID
) {
  let url = this._appendSessionToUrl(
    `get_next_translations/${from_lang}/${to_lang}`
  );

  let body = `word=${word}&context=${context}&url=${pageUrl}&numberOfResults=${numberOfResults}&articleID=${articleID}`;

  if (service) {
    body += `&service=${service}`;
  }

  if (currentTranslation) {
    body += `&currentTranslation=${currentTranslation}`;
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
  pageTitle
) {
  let url = this._appendSessionToUrl(
    `contribute_translation/${from_lang}/${to_lang}`
  );

  let body = `word=${word}&translation=${translation}&context=${context}&url=${pageUrl}&pageTitle=${pageTitle}`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body,
  });
};
