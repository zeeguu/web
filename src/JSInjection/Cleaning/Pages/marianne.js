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

export function cleanMarianne(HTMLContent, readabilityContent) {
  let cleanedContent = removeArticleLinks(readabilityContent);
  cleanedContent = getImageMarianne(HTMLContent, cleanedContent);
  return cleanedContent;
}

function removeArticleLinks(readabilityContent) {
  let div = createDivWithContent(readabilityContent);
  removeAllElementsWithText("p", "À LIRE AUSSI", div);
  return div.innerHTML;
}

function getImageMarianne(HTMLContent, readabilityContent) {
  let div = createDivWithContent(readabilityContent);
  let HTMLDiv = createDivWithContent(HTMLContent);
  const images = HTMLDiv.querySelector(".article__image.article__item");
  if (images) {
    const image = images.querySelector("img");
    if (image) {
      div.prepend(image);
    }
  }
  return div.innerHTML;
}
