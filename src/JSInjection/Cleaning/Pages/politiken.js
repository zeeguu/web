import { removeAllElementsIfExistent } from "../util";

export const politikenRegex = /(http|https):\/\/(politiken.dk).*/;

export function removeSignUp(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsIfExistent('[data-element-type="relation"]', div)
  return div.innerHTML;
}
