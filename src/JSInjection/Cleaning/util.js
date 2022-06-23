export function removeFirstElementIfExistent(element, div) {
  let elem = div.querySelector(element);
  if (elem) {
    elem.remove();
  }
}

export function removeAllElementsIfExistent(element, div) {
  let elem = div.querySelectorAll(element);
  if (elem) {
    elem.remove();
  }
}
