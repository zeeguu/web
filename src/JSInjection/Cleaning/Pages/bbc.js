export const bbcRegex = /(http|https):\/\/(www.bbc.com).*/;
import { removeFirstElementIfExistent } from "../util";

export function cleanBBC(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;

  removeFirstElementIfExistent("[data-component=links-block]", div)

  return div.innerHTML;
}