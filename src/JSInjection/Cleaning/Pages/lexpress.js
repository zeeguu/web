import { removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export const lexpressRegex = /(http|https):\/\/(.*)(.lexpress.fr).*/;

function removeAsides(content) {
  let div = document.createElement("div");
  div.innerHTML = content;
  ["#placeholder--plus-lus", "#placeholder--opinion"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  })
  return div.innerHTML;
}

function unavailableContent(content) {
  if (content.includes("Offrez gratuitement la lecture de cet article à un proche")) {
    return "<p>This article cannot be read in zeeguu reader</p>";
  } else {
    let div = document.createElement("div");
    div.innerHTML = content;
    return div.innerHTML;
  }
}

export function cleanLexpressBefore(documentClone) {
  [".legend"].forEach((className) => {
    removeAllElementsIfExistent(className, documentClone);
  })
  return documentClone;
}

export function cleanLexpress(content) {
  let cleanedContent = removeAsides(content);
  cleanedContent = unavailableContent(cleanedContent);
  return cleanedContent;
}
