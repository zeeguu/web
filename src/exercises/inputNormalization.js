import removeAccents from "remove-accents";

function removeQuotes(x) {
  return x.replace(/[^a-zA-Z ]/g, "");
}

function normalizeCase(x) {
  return x.trim().toUpperCase();
}

function normalizeAnswer(x) {
  return removeQuotes(removeAccents(normalizeCase(x)));
}

export { normalizeAnswer };
