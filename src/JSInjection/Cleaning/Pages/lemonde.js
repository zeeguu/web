import { removeFirstElementIfExistent } from "../util";

export const lemondeRegex = /(http|https):\/\/(www.lemonde.fr).*/;

function removeServices(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  let allElements = Array.from(div.getElementsByTagName("h4"));
  if (allElements) {
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      if (element !== undefined && element !== null) {
        if (element.textContent === "Services") {
          element.remove();
        }
      }
    }
  }
  return div.innerHTML;
}

function removeInjectedContent(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  removeFirstElementIfExistent("#js-capping", div)
  return div.innerHTML;
}

export function removeAuthorDetail(documentClone) {
  removeFirstElementIfExistent(".author__detail", documentClone)
  return documentClone;
}

export function cleanLemonde(content) {
  let lemonde = removeInjectedContent(content);
  return removeServices(lemonde);
}
