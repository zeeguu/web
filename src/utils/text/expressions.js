import { removePunctuation, tokenize } from "./preprocessing";
import { removeByValue } from "../basic/arrays";

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

function isWordIncluded(word, expression) {
  let isWordIncluded = false;
  let wordsInAnswer = expression.split(" ");
  if (!isExpression(word))
    wordsInAnswer.forEach((each) => {
      if (each === word) isWordIncluded = true;
    });
  return isWordIncluded;
}

function countWordsIncluded(expression1, expression2) {
  let wordsIncluded = 0;
  let wordsInExp1 = expression1.split(" ");
  let wordsInExp2 = expression2.split(" ");
  wordsInExp1.forEach((each) => {
    if (wordsInExp2.includes(each)) {
      wordsIncluded += 1;
      removeByValue(wordsInExp2, each);
    }
  });
  return wordsIncluded;
}

export { isWordIncluded, isTextInSentence, isExpression, countWordsIncluded };
