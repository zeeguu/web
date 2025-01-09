import { Zeeguu_API } from "./classDef";
import qs from "qs";

Zeeguu_API.prototype.tokenizeText = function (text, language, callback) {
  /*
   * Returns a list of paragraphs with tokens, which can be consumed by interactiveText
  to render a text that allows translating words.
   */
  let payload = {
    text: text,
    language: language,
  };
  return this._post(`/tokenize_text`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.getSents = function (text, language, callback) {
  /*
   * Returns a list of strings, which are the sentences from the text string.
   */
  let payload = {
    text: text,
    language: language,
  };
  return this._post(`/tokenize_sents`, qs.stringify(payload), callback);
};

Zeeguu_API.prototype.getParagraphs = function (text, language, callback) {
  /**
   * Returns the paragraphs in a text.
   */
  let payload = {
    text: text,
  };
  return this._post(`/get_paragraphs`, qs.stringify(payload), callback);
};
