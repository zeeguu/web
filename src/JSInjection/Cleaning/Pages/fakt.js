import { removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export const faktRegex = /(http|https):\/\/(www.fakt.pl).*/;

export function cleanFaktBefore(documentClone) {
  [".article-gallery-p", ".article-gallery-counter", ".article-contact"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });

  return documentClone;
}

export function removeFaktIFrames(){
  removeFirstElementIfExistent("#slot-flat-plista", document)
  removeAllElementsIfExistent("iframe", document)
}
