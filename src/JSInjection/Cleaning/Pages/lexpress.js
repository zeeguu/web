import { removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export const lexpressRegex = /(http|https):\/\/(.*)(.lexpress.fr).*/;

function removeAsides(readabilityContent) {
  let div = document.createElement("div");
  div.innerHTML = readabilityContent;
  ["#placeholder--plus-lus", "#placeholder--opinion"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  })
  return div.innerHTML;
}

function unavailableContent(readabilityContent) {
  if (readabilityContent.includes("Offrez gratuitement la lecture de cet article à un proche")) {
    return "<p>This article cannot be read in zeeguu reader</p>";
  } else {
    let div = document.createElement("div");
    div.innerHTML = readabilityContent;
    return div.innerHTML;
  }
}

export function cleanLexpressBefore(documentClone) {
  [".legend"].forEach((className) => {
    removeAllElementsIfExistent(className, documentClone);
  })
  return documentClone;
}

export function cleanLexpress(readabilityContent) {
  let cleanedContent = removeAsides(readabilityContent);
  cleanedContent = unavailableContent(cleanedContent);
  return cleanedContent;
}
