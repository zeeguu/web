import { removeAllElementsIfExistent } from "../util";
export const rzeczRegex = /(http|https):\/\/(www.rp.pl).*/;

function removePromo(readabilityContent) {
    const div = document.createElement("div");
    div.innerHTML = readabilityContent;
    removeAllElementsIfExistent(".content", div)
    return div.innerHTML
}

export function cleanRzecz(readabilityContent) {
    return removePromo(readabilityContent)
}

export function cleanRzeczBefore(documentClone) {
  [".marketing--comp", ".articleBodyBlock.content--excerpt.clear-both", "articleBodyBlock.excerpt--article"].forEach((elem) => {
    removeAllElementsIfExistent(elem, documentClone);
  });
  return documentClone;
}
  