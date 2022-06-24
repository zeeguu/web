export const berlingskeRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]berlingske+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
import { removeFirstElementIfExistent } from "../util";

export function cleanBerlingske(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;

  ["#speechkit-notice", "#speechkit-shift", "#speechkit-consent-box", "#tts-notice", "#tts-shift", "#tts-consent-box"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  });

  return div.innerHTML;
}

export function cleanBerlingskeBefore(documentClone) {
  removeFirstElementIfExistent("figcaption", documentClone);
  addAuthorBerlingske(documentClone)
  return documentClone;
}

function addAuthorBerlingske(documentClone){
  const bylineClass = documentClone.querySelector(".article-byline.article-byline--regular")
  const authorsName = documentClone.querySelector(".article-byline__author-name")
  if (bylineClass && authorsName) {
    bylineClass.insertBefore(authorsName, bylineClass.firstChild);
  }
}
