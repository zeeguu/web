import { Zeeguu_API } from "./classDef";
import qs from "qs";

// Short texts a learner brings (a WhatsApp message, a mail paragraph):
// stored once on the server, listed per learner. See the API's
// endpoints/short_texts.py.

// Keeps the text and answers { id }. `language` when the learner corrected
// the guess; `insteadOf` the id of the text read in the wrong language,
// which then leaves the list.
Zeeguu_API.prototype.addShortText = function (text, { language = null, insteadOf = null } = {}, onSuccess, onError) {
  const payload = { text };
  if (language) payload.language = language;
  if (insteadOf) payload.instead_of = insteadOf;
  this._post(`/short_texts`, qs.stringify(payload), onSuccess, onError, true);
};

// The learner's texts, most recently opened first.
Zeeguu_API.prototype.getShortTexts = function (onSuccess, onError, { limit = 20, offset = 0 } = {}) {
  this._getJSON(`short_texts?limit=${limit}&offset=${offset}`, onSuccess, { onError });
};

// For the reader: { id, text, language, source_id, tokenized_paragraphs, past_bookmarks }
Zeeguu_API.prototype.getShortText = function (id, onSuccess, onError) {
  this._getJSON(`short_texts/${id}`, onSuccess, { onError });
};

// Record reopening a text already loaded in the client (bumps last_opened_at and logs open).
Zeeguu_API.prototype.touchShortText = function (id) {
  this._post(`/short_texts/${id}/touch`, "", () => {}, () => {});
};

// Off the learner's list; words learned from it stay.
Zeeguu_API.prototype.forgetShortText = function (id, onSuccess, onError) {
  this.apiLog("DELETE short_texts/" + id);
  fetch(this._appendSessionToUrl(`short_texts/${id}`), { method: "DELETE" })
    .then((response) => (response.ok ? onSuccess?.() : onError?.(`HTTP ${response.status}`)))
    .catch((e) => onError?.(e));
};
