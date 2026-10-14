import removeAccents from "remove-accents";

function removePunctuation(x) {
  // Remove punctuation and special characters, but keep letters from all alphabets (Latin, Greek, Cyrillic, etc.)
  // \p{L} matches any Unicode letter
  return x.replace(/[^\p{L} ]/gu, "");
}

function normalizeCase(x) {
  return x.trim().toUpperCase();
}

function normalizeAnswer(x) {
  return removePunctuation(removeAccents(normalizeCase(x)));
}

// The normalized answers a typed translation may match. Most translations
// are one, but some list the forms of one word ("твій/твоя/твоє/твої" for
// "your", "αυτοί/αυτές/αυτά" for "they"): the source doesn't say which
// gender or number, so any one form is right. The API keeps such lists and
// reduces real alternatives to one (single_translation.py).
function acceptedAnswers(solution) {
  const whole = normalizeAnswer(solution);
  const forms = solution.split("/").map(normalizeAnswer);
  if (forms.length < 2 || forms.some((f) => f === "")) return [whole];
  return [whole, ...forms];
}

export { normalizeAnswer, acceptedAnswers };
