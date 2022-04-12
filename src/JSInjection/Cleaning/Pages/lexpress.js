export const lexpressRegex = /(http|https):\/\/(.*)(.express.fr).*/;

function removeAsides(content) {
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

function unavailableContent(content) {
  //TODO: find better solution
  if (
    content.includes(
      "Offrez gratuitement la lecture de cet article à un proche"
    )
  ) {
    return "<p>This article cannot be read in zeeguu reader</p>";
  } else {
    let div = document.createElement("div");
    div.innerHTML = content;
    return div.innerHTML;
  }
}

//remove illustration__caption class - not working
export function removeCaption(documentClone) {
  const captions = documentClone.getElementsByClassName(
    "illustration__caption"
  );
  if (captions) {
    while (captions.length > 0) {
      captions[0].parentNode.removeChild(captions[0]);
    }
  }
  return documentClone;
}

export function cleanLexpress(content) {
  let cleanedContent = removeAsides(content);
  cleanedContent = unavailableContent(cleanedContent);
  return cleanedContent;
}
