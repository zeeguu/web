import { createDivWithContent, removeAllElementsIfExistent } from "../util";

export const rzeczRegex = /(http|https):\/\/(www.rp.pl).*/;

export function cleanRzeczBefore(documentClone) {
  [".marketing--comp", ".articleBodyBlock.content--excerpt.clear-both", "articleBodyBlock.excerpt--article"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });
  return documentClone;
}

export function cleanRzecz(readabilityContent) {
  return removePromo(readabilityContent)
}

function removePromo(readabilityContent) {
  const div = createDivWithContent(readabilityContent);
  removeAllElementsIfExistent(".content", div);
  return div.innerHTML;
}
  