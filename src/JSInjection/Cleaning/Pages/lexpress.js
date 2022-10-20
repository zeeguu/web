import { createDivWithContent, removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export const lexpressRegex = /(http|https):\/\/(.*)(.lexpress.fr).*/;

export function cleanLexpressBefore(documentClone) {
  [".legend", ".abo-inread"].forEach((className) => {
    removeAllElementsIfExistent(className, documentClone);
  })
  return documentClone;
}

export function cleanLexpress(readabilityContent) {
  let cleanedContent = removeAsides(readabilityContent);
  cleanedContent = unavailableContent(cleanedContent);
  return cleanedContent;
}

function removeAsides(readabilityContent) {
  const div = createDivWithContent(readabilityContent);
  ["#placeholder--plus-lus", "#placeholder--opinion"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  })
  return div.innerHTML;
}

function unavailableContent(readabilityContent) {
  if (readabilityContent.includes("Offrez gratuitement la lecture de cet article à un proche")) {
    return "<p>This article cannot be read in zeeguu reader</p>";
  } else {
    const div = createDivWithContent(readabilityContent)
    return div.innerHTML;
  }
}
