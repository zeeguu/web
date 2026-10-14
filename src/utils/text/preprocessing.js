// doesn't remove punctuation when it is part of a word, e.g. "l'Italie" or "it's"
function removePunctuation(string) {
  let removeLeadingPunctuation =
    /(\s|^)[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+/g;
  let removeTrailingPunctuation =
    /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+(\s|$)$/g;
  return string
    .replace(removeLeadingPunctuation, "$1")
    .replace(removeTrailingPunctuation, "");
}

function tokenize(sentence) {
  return sentence.split(" ");
}

export { tokenize, removePunctuation };
