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

export function cleanDRBefore(documentClone){
  const dateInByline = documentClone.getElementsByClassName("dre-byline__dates");
  if (dateInByline[0].parentNode) {
    dateInByline[0].parentNode.removeChild(dateInByline[0]);
  }
  const prefixInByLine = documentClone.getElementsByClassName("dre-byline__prefix");
  if (prefixInByLine[0].parentNode) {
    prefixInByLine[0].parentNode.removeChild(prefixInByLine[0]);
  }
  return documentClone;
}