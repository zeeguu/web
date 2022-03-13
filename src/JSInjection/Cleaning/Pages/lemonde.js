export const lemondeRegex = /(http|https):\/\/(www.lemonde.fr).*/;

//function removeListElementsHeaders(content) {
//  const div = document.createElement("div");
//  div.innerHTML = content;
//  let listElements = Array.from(div.querySelectorAll("UL"));
//  for (let i = 0; i < listElements.length; i++) {
//    let li = listElements[i].children[0];
//    let ul = listElements[i];
//    if (li !== undefined) {
//      if (li.nodeName === "LI") {
//        const element = li.children[0];
//        if (element !== undefined) {
//          if (element.nodeName === "H2") {
//            let siblingToUl = listElements[i].nextSibling;
//            let parent = listElements[i].parentNode;
//            let newH = element;
//            let frag = document.createDocumentFragment();
//            frag.appendChild(newH);
//            parent.removeChild(ul);
//            siblingToUl.parentNode.insertBefore(frag, siblingToUl);
//          }
//        }
//      }
//    }
//  }
//  return div.innerHTML;
//}

function removeServices(content) {
  //remove services header and everything below that is injected by lemonde
  const div = document.createElement("div");
  div.innerHTML = content;
  let allElements = Array.from(div.getElementsByTagName("h4"));
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    if ((element !== undefined) && (element !== null)) {
      if (element.textContent === "Services") {
        element.remove();
      }
    }
  }
  return div.innerHTML;
}

function removeInjectedContent(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  let element = div.querySelector("#js-capping");
  if ((element !== undefined) && (element !== null)) {
    element.remove();
    content = div.innerHTML;
  }

  return div.innerHTML;
}

export function removeAuthorDetail(documentClone) {
  let detail = documentClone.getElementsByClassName("author__detail")[0];
  if ((detail !== undefined) && (detail !== null)) {
    detail.parentNode.removeChild(detail);
  }
  return documentClone
}

export function cleanLemonde(content) {
  let lemonde = removeInjectedContent(content)
  return removeServices(lemonde)
}