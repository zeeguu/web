export const berlingskeRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]berlingske+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;


export function cleanBerlingske(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let notice = div.querySelector("#speechkit-notice");
  if (notice !== undefined && notice !== null) {
    notice.remove();
  }
  let shift = div.querySelector("#speechkit-shift");
  if (shift !== undefined && shift !== null) {
    shift.remove();
  }
  let consent = div.querySelector("#speechkit-consent-box");
  if (consent !== undefined && consent !== null) {
    consent.remove();
  }
  console.log(div.innerHTML);
  return div.innerHTML;
}
