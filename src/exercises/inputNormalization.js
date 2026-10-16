import removeAccents from "remove-accents";

function removePunctuation(x) {
  // Remove punctuation and special characters, but keep letters from all alphabets (Latin, Greek, Cyrillic, etc.)
  // \p{L} matches any Unicode letter
  return x.replace(/[^\p{L} ]/gu, "");
}

function normalizeCase(x) {
  return x.trim().toUpperCase();
}

// English glosses of verbs come with and without the infinitive "to" ("to
// look up", "look up"), and the source word ("slå op") rarely tells which:
// either is right. Only a leading "to" with something after it, so "listen
// to" keeps its "to" and the gloss "to" (Danish "til") stays a word.
function withoutInfinitiveTo(normalized, languageCode) {
  return languageCode === "en" && normalized.startsWith("TO ") ? normalized.slice(3).trim() : normalized;
}

// languageCode: the language the answer is typed in, for its own conventions.
function normalizeAnswer(x, languageCode) {
  return withoutInfinitiveTo(removePunctuation(removeAccents(normalizeCase(x))), languageCode);
}

// The normalized answers a typed translation may match. Most translations
// are one, but some list the forms of one word ("твій/твоя/твоє/твої" for
// "your", "αυτοί/αυτές/αυτά" for "they"): the source doesn't say which
// gender or number, so any one form is right. The API keeps such lists and
// reduces real alternatives to one (single_translation.py).
function acceptedAnswers(solution, languageCode) {
  const whole = normalizeAnswer(solution, languageCode);
  const forms = solution.split("/").map((form) => normalizeAnswer(form, languageCode));
  if (forms.length < 2 || forms.some((f) => f === "")) return [whole];
  return [whole, ...forms];
}

export { normalizeAnswer, acceptedAnswers };
