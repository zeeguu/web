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
  // let cleaned = addImageEkstraBladet(HTMLContent, removedDate);
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
