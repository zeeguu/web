export const bbcRegex = /(http|https):\/\/(www.bbc.com).*/;
import { removeFirstElementIfExistent } from "../util";

//export function cleanBBC(readabilityContent) {
//  const newDiv = document.createElement("div");
//  newDiv.innerHTML = readabilityContent;
//  const readMore = newDiv.querySelectorAll("[data-component=links-block]")[0];
//  if (readMore) {
//    readMore.remove();
//  }
//  return newDiv.innerHTML;
//}//


export function cleanBBC(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;

  removeFirstElementIfExistent("[data-component=links-block]", div)

  return div.innerHTML;
}