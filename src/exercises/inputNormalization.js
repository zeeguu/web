import removeAccents from "remove-accents";

function removeQuotes(x) {
  return x.replace(/[^a-zA-Z ]/g, "");
}

function normalizeCase(x) {
  return x.trim().toUpperCase();
}

function normalizeWord(x) {
  return removeQuotes(removeAccents(normalizeCase(x)));
}

export { normalizeWord };
