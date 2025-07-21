import { addCommas, removeAllElementsIfExistent } from "../util";
export const drRegex =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]dr+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function cleanDRBefore(documentClone) {
  let cleanedDocumentClone = removePrefixandDate(documentClone);
  cleanedDocumentClone = multipleAuthors(cleanedDocumentClone);
  cleanedDocumentClone = removeNumberInHeadline(cleanedDocumentClone);
  cleanedDocumentClone = removeFigureCaptions(cleanedDocumentClone);
  return cleanedDocumentClone;
}

function removePrefixandDate(documentClone) {
  [".dre-byline__dates", ".dre-byline__prefix"].forEach((className) => {
    removeAllElementsIfExistent(className, documentClone);
  });
  return documentClone;
}

function multipleAuthors(documentClone) {
  addCommas(".dre-byline__contribution", documentClone)
  return documentClone;
}

function removeNumberInHeadline(documentClone) {
removeAllElementsIfExistent(".dre-article-body-emphasized-list-sub-heading__marker", documentClone)
return documentClone;
}

function removeFigureCaptions(documentClone) {
  removeAllElementsIfExistent(".dre-caption", documentClone)
  return documentClone;
  }
  
export function saveElements() {
  const keepElem = document.querySelectorAll('[id^="sas"]');
  return keepElem;
}

export function addElements(keepElem) {
  for (var i = 0; i < keepElem.length; i++) {
    keepElem[i].setAttribute("style", `display:none`);
    document.body.appendChild(keepElem[i]);
  }
}
