import { removeAllElementsIfExistent, removeAllElementsWithText } from "../util";

export const ekstrabladetRegex = /^(http|https):\/\/ekstrabladet.dk\/.*/;

export function addImageEkstraBladet(HTMLContent, readabilityContent) {
  const HTMLDiv = document.createElement("div");
  HTMLDiv.innerHTML = HTMLContent;
  const imageClass = HTMLDiv.querySelector(".figure-image border-radius");

  // create a new div with the content from readability
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;

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

export function removePrefix(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  const header = div.querySelector("header");
  if (header) {
    let firstDiv = header.querySelector("div");
    if (firstDiv) {
      firstDiv.remove();
    }
  }
  return div.innerHTML;
}

export function cleanEkstraBladet(HTMLContent, readabilityContent) {
  const removedDate = removePrefix(readabilityContent);
  let cleaned = addImageEkstraBladet(HTMLContent, removedDate);
  return cleaned;
}

export function cleanEkstraBladetBefore(documentClone) {
  [".split-element--ekstra", ".jw-reset", ".figure.image-container"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone)
  });
  removeAllElementsWithText("p", "Artiklen fortsætter under", documentClone)
  return documentClone;
}
