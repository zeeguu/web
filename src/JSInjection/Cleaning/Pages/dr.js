export const drRegex =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]dr+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function cleanDR(readabilityContent) {
    const div = document.createElement("div");
    div.innerHTML = readabilityContent;
    let figure = div.getElementsByTagName("figure"),
    index;
  for (index = figure.length - 1; index >= 0; index--) {
    if (index !== 0) {
      figure[index].parentNode.removeChild(figure[index]);
    }
  }
   return div.innerHTML;
}

export function cleanDRBefore(documentClone) {
  let cleanedDocumentClone = removePrefixandDate(documentClone)
  cleanedDocumentClone = multipleAuthors(cleanedDocumentClone);
  cleanedDocumentClone = removeNumberInHeadline(cleanedDocumentClone)
  return documentClone;
}


function removePrefixandDate(documentClone){
  const dateInByline = documentClone.getElementsByClassName("dre-byline__dates");
  if (dateInByline != undefined) {
    if (dateInByline[0].parentNode) {
      dateInByline[0].parentNode.removeChild(dateInByline[0]);
    }
  const prefixInByLine = documentClone.getElementsByClassName("dre-byline__prefix");
  if (prefixInByLine != undefined) {
    if (prefixInByLine[0].parentNode) {
      prefixInByLine[0].parentNode.removeChild(prefixInByLine[0]);
    }
  }
}
return documentClone
}

function multipleAuthors(documentClone){
  const authors = documentClone.getElementsByClassName("dre-byline__contribution");
  if (authors != undefined) {
    for (let i = 0; i < authors.length; i++) {
      if (i != authors.length - 1) {
        authors[i].innerHTML += ", ";
      }
    }
  }
  return documentClone;
}

function removeNumberInHeadline(documentClone){
  const headlineNumber = documentClone.getElementsByClassName("dre-article-body-emphasized-list-sub-heading__marker");
  const arrayOfHeadlineNumbers = Array.from(headlineNumber)
  arrayOfHeadlineNumbers.forEach(element => {
    if (element != undefined) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  });
  return documentClone
}