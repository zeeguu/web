export const egyszervoltRegex = /(http|https):\/\/(egyszervolt.hu).*/;

function removeIMGTag(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let image = div.querySelector("img");
  if (image) {
    image.remove();
    div.appendChild(image);
  }
  return div.innerHTML;
}

export function cleanEgyszervolt(readabilityContent) {
  return removeIMGTag(readabilityContent);
}
