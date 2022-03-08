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

export function unavailableContent(content) {
  //TODO: find better solution
  if(content.includes("Offrez gratuitement la lecture de cet article à un proche")) {
    return "<p>This article cannot be read in zeeguu reader</p>";
  } else {
    let div = document.createElement("div");
    div.innerHTML = content;
    return div.innerHTML;
  }
}
