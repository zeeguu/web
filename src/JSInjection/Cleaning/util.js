export function removeFirstElementIfExistent(element, div) {
  let elem = div.querySelector(element);
  if (elem) {
    elem.remove();
  }
}

export function removeAllElementsIfExistent(element, div) {
  let elements = div.querySelectorAll(element);
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
}}

export function removeAllElementsWithText(element, text, div) {
  let elems = div.querySelectorAll(element);
  Array.from(elems).filter((elem) =>
    elem.textContent.includes(text) ? elem.remove() : elem
  );
}

export function addCommas(element, div) {
  const elements = div.querySelectorAll(element);
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      if (i != elements.length - 1) {
        elements[i].innerHTML += ", ";
      }
    }
  }
}

export function changeTagToParagraph(element, div) {
  let currentElement = div.querySelector(element);
  if (currentElement) {
    let newElement = div.createElement("p");
    newElement.innerHTML = currentElement.innerHTML;
    currentElement.parentNode.replaceChild(newElement, currentElement);
  }
}

export function createDivWithContent(content){
  const div = document.createElement("div");
  div.innerHTML = content
  return div
}
