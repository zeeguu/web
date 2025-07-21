import { removeAllElementsIfExistent } from "../util";

export const spiegelRegex = /(http|https):\/\/(www\.spiegel\.de).*/;

export function cleanSpiegelBefore(documentClone) {
  [".sticky", "figcaption"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });

  return documentClone;
}
