import { createDivWithContent, removeAllElementsIfExistent } from "../util";

export const politikenRegex = /(http|https):\/\/(politiken.dk).*/;

export function cleanPolitiken(readabilityContent){
  return removeSignUp(readabilityContent)
}

function removeSignUp(readabilityContent) {
  const div = createDivWithContent(readabilityContent)
  removeAllElementsIfExistent('[data-element-type="relation"]', div)
  return div.innerHTML;
}

export function cleanPolitikenBefore(documentClone) {
  [".text-to-speech__disclaimer"].forEach((className) => {
    removeAllElementsIfExistent(className, documentClone);
  })
  return documentClone;
}

