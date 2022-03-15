export const berlingskeRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]berlingske+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function cleanBerlingske(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let notice = div.querySelector("#speechkit-notice");
  if (notice) {
    notice.remove();
  }
  let shift = div.querySelector("#speechkit-shift");
  if (shift) {
    shift.remove();
  }
  let consent = div.querySelector("#speechkit-consent-box");
  if (consent) {
    consent.remove();
  }
  return div.innerHTML;
}

export function cleanBerlingskeBefore(documentClone) {
  const figcaption = documentClone.getElementsByTagName("figcaption")[0];
  if (figcaption) {
    figcaption.remove();
  }
  const bylineClass = documentClone.getElementsByClassName("article-byline article-byline--regular")[0];
  const authorsName = documentClone.getElementsByClassName("article-byline__author-name")[0];
  if (bylineClass && authorsName) {
    bylineClass.insertBefore(authorsName, bylineClass.firstChild);
  }
  return documentClone;
}
