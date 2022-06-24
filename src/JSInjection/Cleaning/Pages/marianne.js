import {
  changeTagToParagraph,
  removeAllElementsIfExistent,
  removeAllElementsWithText,
} from "../util";

export const marianneRegex = /(http|https):\/\/(www\.marianne\.net).*/;

function removeArticleLinks(readabilityContent) {
  let div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsWithText("p", "À LIRE AUSSI", div);
  return div.innerHTML;
}

function getImageMarianne(HTMLContent, readabilityContent) {
  //search for image in readability content
  let div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let hasImage = div.querySelectorAll("img");
  if (hasImage) {
    if (hasImage.length === 0) {
      //get image from entire html
      let newDiv = document.createElement("div");
      newDiv.innerHTML = HTMLContent;
      const images = newDiv.querySelector(".article__image.article__item");
      if (images) {
        const image = images.querySelectorAll("img");
        if (image) {
          div.prepend(image[0]);
        }
      }
    }
  }
  return div.innerHTML;
}

export function cleanMarianne(HTMLContent, readabilityContent) {
  let cleanedContent = removeArticleLinks(readabilityContent);
  cleanedContent = getImageMarianne(HTMLContent, cleanedContent);
  return cleanedContent;
}

export function cleanMarianneBefore(documentClone) {
  [".article__details", ".article__premium"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });
  changeTagToParagraph(".article__headline.article__item", documentClone);
  return documentClone;
}
