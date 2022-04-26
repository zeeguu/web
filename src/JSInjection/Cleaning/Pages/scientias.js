export const scientiasRegex = /(http|https):\/\/(scientias.nl).*/;

export function convertStrongToHeader(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;
  const pTags = newDiv.getElementsByTagName("p")
  if (pTags.length !== 0) {
    for (let i = 0; i < pTags.length; i++) {
      const children = pTags[i].children;
      if (children.length !== 0) {
        for (let j = 0; j < children.length; j++) {
          if (children[j].tagName === "STRONG") {
            const header = document.createElement("H4");
            header.textContent = children[j].textContent;
            const parent = children[j].parentElement
            children[j].remove()
            parent.before(header)
          }
        }
      }
    }
  }
  return newDiv.innerHTML
}