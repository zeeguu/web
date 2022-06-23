import { removeFirstElementIfExistent } from "../util";

export const lemondeRegex = /(http|https):\/\/(www.lemonde.fr).*/;

function removeServices(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
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

function removeInjectedContent(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeFirstElementIfExistent("#js-capping", div)
  return div.innerHTML;
}

function removeAuthorDetail(documentClone) {
  removeFirstElementIfExistent(".author__detail", documentClone)
  return documentClone;
}

export function cleanLemondeBefore(documentClone){
return removeAuthorDetail(documentClone)
}

export function cleanLemonde(readabilityContent) {
  let cleanedContent = removeInjectedContent(readabilityContent);
  return removeServices(cleanedContent);
}
