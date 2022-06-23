import { removeAllElementsIfExistent } from "../util";

export const politikenRegex = /(http|https):\/\/(politiken.dk).*/;

function removeSignUp(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsIfExistent('[data-element-type="relation"]', div)
  return div.innerHTML;
}

export function cleanPolitiken(readabilityContent){
  return removeSignUp(readabilityContent)
}
