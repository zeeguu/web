import { removeAllElementsIfExistent } from "../util";

export const expressRegex = /(http|https):\/\/(www.express.co.uk).*/;

export function cleanExpressBefore(documentClone) {
  [".newsletter-pure", ".two-related-articles", ".related-articles", ".main-navigation", ".newsCaption", ".jw-player-title"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });

  return documentClone;
}
