export const nuRegex = /^(http|https):\/\/(www.)nu.nl\/.*/;

export function removeBlockTitle(documentClone) {
  const blockTitle = documentClone.getElementsByClassName("block-title");
  console.log("noscript", blockTitle);
  while (blockTitle.length > 0) {
    let elem = blockTitle[0];
    elem.parentElement.removeChild(elem);
  }
  return documentClone;
}
