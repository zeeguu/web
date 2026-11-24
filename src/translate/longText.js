// What Translate does with a text too long to look up: a sentence or a
// message is read word by word (/texts/read), not translated in one go.
// Lookups cover words and phrases up to a few words (examples are fetched
// only up to 3); a line break means a message, whatever its length.
export const MAX_WORDS_TO_TRANSLATE = 6;

export function isTooLongToTranslate(text) {
  const body = (text || "").trim();
  if (!body) return false;
  if (/\n/.test(body)) return true;
  return body.split(/\s+/).length > MAX_WORDS_TO_TRANSLATE;
}

// Whether a paste is a word or a phrase, worth looking up at once. The
// clipboard holds whatever was copied last (a path, a code, a time): that
// waits in the field, for the learner to decide.
const WORD = /^[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*[.,!?]?$/u;

export function looksLikeWords(text) {
  const body = (text || "").trim();
  if (!body || isTooLongToTranslate(body)) return false;
  return body.split(/\s+/).every((token) => WORD.test(token));
}
