export const egyszervoltRegex = /(http|https):\/\/(egyszervolt.hu).*/;

function removeIMGTag(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  let image = div.querySelector("img");
  if (image) {
    image.remove();
    div.appendChild(image);
  }
  return div.innerHTML;
}

export function cleanEgyszervolt(content) {
  return removeIMGTag(content);
}
