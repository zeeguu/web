import {
  changeTagToParagraph,
  createDivWithContent,
  removeAllElementsIfExistent,
  removeAllElementsWithText,
} from "../util";

export const marianneRegex = /(http|https):\/\/(www\.marianne\.net).*/;

export function cleanMarianneBefore(documentClone) {
  [".article__details", ".article__premium"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });
  changeTagToParagraph(".article__headline.article__item", documentClone);
  return documentClone;
}

export function cleanMarianne(readabilityContent) {
  let cleanedContent = removeArticleLinks(readabilityContent);
  return cleanedContent;
}

function removeArticleLinks(readabilityContent) {
  let div = createDivWithContent(readabilityContent);
  removeAllElementsWithText("p", "À LIRE AUSSI", div);
  return div.innerHTML;
}