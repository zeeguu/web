export const scientiasRegex = /(http|https):\/\/(scientias.nl).*/;

function convertStrongToHeader(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  const pTags = div.querySelectorAll("p")
  if (pTags) {
    for (let i = 0; i < pTags.length; i++) {
      const children = pTags[i].children;
      if (children) {
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
  return div.innerHTML
}

export function cleanScientias(readabilityContent){
return convertStrongToHeader(readabilityContent)
}