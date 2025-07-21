import { createDivWithContent, removeFirstElementIfExistent } from "../util";

export const bbcRegex = /(http|https):\/\/(www.bbc.com).*/;

export function cleanBBC(readabilityContent) {
  const div = createDivWithContent(readabilityContent)
  removeFirstElementIfExistent("[data-component=links-block]", div)
  return div.innerHTML;
}