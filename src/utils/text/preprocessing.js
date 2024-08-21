// doesn't remove punctuation when it is part of a word, e.g. "l'Italie" or "it's"
function removePunctuation(string) {
  let removeLeadingPunctuation =
    /(\s|^)[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+/g;
  let removeTrailingPunctuation =
    /[¡!"”“„#$%&'(–)*+,…./—:;«<=>»¿?@[\]^_`{|}~]+(\s|$)/g;
  return string
    .replace(removeLeadingPunctuation, "")
    .replace(removeTrailingPunctuation, "");
}

function tokenize(sentence) {
  return sentence.split(" ");
}

function isExpression(text) {
  return text.includes(" ");
}

function isTextInSentence(text, sentence) {
  if (isExpression(text)) {
    return sentence.includes(text);
  }
  let tokens = tokenize(sentence);
  tokens = tokens.map((each) => removePunctuation(each));
  return tokens.includes(removePunctuation(text));
}

function wordIncluded(input, expression) {
  let isWordIncluded = false;
  let wordsInAnswer = expression.split(" ");
  let wordsInInput = input.split(" ");
  if (wordsInInput.length === 1)
    wordsInAnswer.forEach((word) => {
      if (input === word) isWordIncluded = true;
    });
  return isWordIncluded;
}

export {
  tokenize,
  removePunctuation,
  isTextInSentence,
  isExpression,
  wordIncluded,
};
