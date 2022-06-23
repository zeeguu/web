export const corriereRegex = /(http|https):\/\/(www.corriere.it).*/;
import { removeAllElementsIfExistent, removeFirstElementIfExistent } from "../util";

export function removeScripts(){
  ["iframe", "script"].forEach((elem) => {
    removeAllElementsIfExistent(elem, document);
  });

  removeFirstElementIfExistent(".tp-modal", document)
}
