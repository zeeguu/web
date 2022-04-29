export const bbcRegex = /(http|https):\/\/(www.bbc.com).*/;

export function cleanBBC(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;
  const readMore = newDiv.querySelectorAll("[data-component=links-block]")[0];
  if (readMore) {
    readMore.remove();
  }
  return newDiv.innerHTML;
}
