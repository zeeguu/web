import { Zeeguu_API } from "./classDef";
import qs from "qs";

// A message shared in from another app (WhatsApp...). Nothing is stored: the
// API guesses the language and tokenizes it for InteractiveText. Pass
// `language` when the learner corrects the guess.
Zeeguu_API.prototype.prepareSharedText = function (text, language, onSuccess, onError) {
  const payload = language ? { text, language } : { text };
  this._post(`/shared_text/prepare`, qs.stringify(payload), onSuccess, onError, true);
};

Zeeguu_API.prototype.translateSharedText = function (text, fromLang, toLang, onSuccess, onError) {
  this._post(`/shared_text/translate/${fromLang}/${toLang}`, qs.stringify({ text }), onSuccess, onError, true);
};
