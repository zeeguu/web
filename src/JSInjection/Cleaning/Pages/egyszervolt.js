import { createDivWithContent } from "../util";

export const egyszervoltRegex = /(http|https):\/\/(egyszervolt.hu).*/;

export function cleanEgyszervolt(readabilityContent) {
  return removeIMGTag(readabilityContent);
}
  
function removeIMGTag(readabilityContent) {
  const div = createDivWithContent(readabilityContent);
  let image = div.querySelector("img");
  if (image) {
    image.remove();
    div.appendChild(image);
  }
  return div.innerHTML;
}
