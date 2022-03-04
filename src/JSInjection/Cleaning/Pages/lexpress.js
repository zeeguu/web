export const lexpressRegex = /(http|https):\/\/(.*)(.express.fr).*/;

export function removeasides(content) {
  let div = document.createElement("div");
  div.innerHTML = content;
  let opinions = div.querySelector("#placeholder--plus-lus");
  if (opinions !== null) {
    opinions.remove();
  }
  let pluslus = div.querySelector("#placeholder--opinion");
  if (pluslus !== null) {
    pluslus.remove();
  }
  return div.innerHTML;
}
