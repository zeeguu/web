import { getHTMLContent } from "../pageSpecificClean";
import { createDivWithContent, removeAllElementsIfExistent, removeAllElementsWithText } from "../util";

export const ekstrabladetRegex = /^(http|https):\/\/ekstrabladet.dk\/.*/;

export function cleanEkstraBladetBefore(documentClone) {
  [".split-element--ekstra", ".jw-reset", ".figure.image-container"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone)
  });
  removeAllElementsWithText("p", "Artiklen fortsætter under", documentClone)
  return documentClone;
}

export function cleanEkstraBladet(readabilityContent, url) {
  const HTMLContent = getHTMLContent(url)
  const removedDate = removePrefix(readabilityContent);
  let cleaned = addImageEkstraBladet(HTMLContent, removedDate);
  return cleaned;
}

function addImageEkstraBladet(HTMLContent, readabilityContent) {
  const HTMLDiv = createDivWithContent(HTMLContent)
  const div = createDivWithContent(readabilityContent)
  const imageClass = HTMLDiv.querySelector(".figure-image border-radius");
  // If a main image exists add it to the readability content
  if (imageClass != undefined) {
    const imageAlt = imageClass.getAttribute("alt");
    const image = imageClass.currentSrc;
    const newImage = document.createElement("img");
    newImage.setAttribute("src", image);
    newImage.setAttribute("alt", imageAlt);
    div.prepend(newImage);
  }
  return div.innerHTML;
}

function removePrefix(readabilityContent) {
  const div = createDivWithContent(readabilityContent)
  const header = div.querySelector("header");
  if (header) {
    let firstDiv = header.querySelector("div");
    if (firstDiv) {
      firstDiv.remove();
    }
  }
  return div.innerHTML;
}
