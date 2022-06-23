import { removeAllElementsIfExistent } from "../util";

export const wyborczaRegex = /(http|https):\/\/(wyborcza.pl).*/;

export function cleanWyborcza(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsIfExistent("[id^=mcBan]", div)
  return div.innerHTML;
}
