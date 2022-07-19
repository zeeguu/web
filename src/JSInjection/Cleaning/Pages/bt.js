import { createDivWithContent, removeFirstElementIfExistent } from "../util";

export const btRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]bt+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function cleanBT(readabilityContent) {
  let cleanedContent = removeTTSNotice(readabilityContent);
  return cleanedContent;
}
function removeTTSNotice(readabilityContent) {
  const div = createDivWithContent(readabilityContent);
  ["#tts-notice", "#tts-shift", "#tts-consent-box"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  });
  return div.innerHTML;
}