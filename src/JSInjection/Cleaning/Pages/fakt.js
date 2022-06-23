import { removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export const faktRegex = /(http|https):\/\/(www.fakt.pl).*/;

export function cleanFakt(documentClone) {
  [".article-gallery-p", ".article-gallery-counter", ".article-contact"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });

  return documentClone;
}

export function removeIFrames(){
  removeFirstElementIfExistent("#slot-flat-plista", document)
  removeAllElementsIfExistent("iframe", document)
}
