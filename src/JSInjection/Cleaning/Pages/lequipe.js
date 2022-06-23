import { removeAllElementsIfExistent } from "../util";

export const leqiupeRegex = /(http|https):\/\/(www.lequipe.fr).*/;

//before clean:
export function cleanLequipeBefore(documentClone) {
  removeAllElementsIfExistent(".Author__infos", documentClone)
  return documentClone;
}
