import { removeAllElementsIfExistent } from "../util";

export const nuRegex = /^(http|https):\/\/(www.)nu.nl\/.*/;

function removeBlockTitle(documentClone) {
  removeAllElementsIfExistent(".block-title", documentClone)
  return documentClone;
}

export function cleanNuBefore(documentClone){
  return removeBlockTitle(documentClone)
}
