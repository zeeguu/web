export const lemondeRegex = /(http|https):\/\/(www.lemonde.fr).*/;

function removeServices(content) {
  //remove services header and everything below that is injected by lemonde
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
  let element = div.querySelector("#js-capping");
  if (element !== undefined && element !== null) {
    element.remove();
    content = div.innerHTML;
  }

  return div.innerHTML;
}

export function removeAuthorDetail(documentClone) {
  let detail = documentClone.getElementsByClassName("author__detail")[0];
  if (detail !== undefined && detail !== null) {
    detail.parentNode.removeChild(detail);
  }
  return documentClone;
}

export function cleanLemonde(content) {
  let lemonde = removeInjectedContent(content);
  return removeServices(lemonde);
}
