export const bbcRegex = /(http|https):\/\/(www.bbc.com).*/;
import { createDivWithContent, removeFirstElementIfExistent } from "../util";

export function cleanBBC(readabilityContent) {
  const div = createDivWithContent(readabilityContent)
  removeFirstElementIfExistent("[data-component=links-block]", div)
  return div.innerHTML;
}