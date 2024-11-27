import { removePunctuation, tokenize } from "./preprocessing";

function isExpression(text) {
  return text.includes(" ");
}

function getExpressionlength(text) {
  return text.split(" ").length;
}

function isTextInSentence(text, sentence) {
  if (isExpression(text)) {
    return sentence.includes(text);
  }
  let tokens = tokenize(sentence);
  tokens = tokens.map((each) => removePunctuation(each));
  return tokens.includes(removePunctuation(text));
}

function isWordIncluded(word, expression) {
  let isWordIncluded = false;
  let wordsInAnswer = expression.split(" ");
  if (!isExpression(word))
    wordsInAnswer.forEach((each) => {
      if (each === word) isWordIncluded = true;
    });
  return isWordIncluded;
}

function countCommonWords(expression1, expression2) {
  let wordsInExp1 = new Set(expression1.split(" "));
  let wordsInExp2 = new Set(expression2.split(" "));
  return wordsInExp1.intersection(wordsInExp2).size;
}

export {
  isWordIncluded,
  isTextInSentence,
  isExpression,
  countCommonWords,
  getExpressionlength,
};
