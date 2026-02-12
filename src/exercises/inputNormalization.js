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

export { normalizeAnswer };
