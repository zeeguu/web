export function removeIdIfExistent(id, div) {
  let elem = div.querySelector(id);
  if (elem) {
    elem.remove();
  }
}
