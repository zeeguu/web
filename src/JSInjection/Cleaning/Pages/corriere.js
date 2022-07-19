import {removeAllElementsIfExistent, removeFirstElementIfExistent} from "../util";

export const corriereRegex = /(http|https):\/\/(www.corriere.it).*/;

export function removeCorriereScripts() {
  ["iframe", "script"].forEach((elem) => {
    removeAllElementsIfExistent(elem, document);
  });
  removeFirstElementIfExistent(".tp-modal", document);
}
