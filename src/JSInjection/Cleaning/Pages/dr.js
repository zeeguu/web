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