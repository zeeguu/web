export const rzeczRegex = /(http|https):\/\/(www.rp.pl).*/;
//removes all images
function removeImages(readabilityContent) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;

  const images = newDiv.querySelectorAll("img")
  for (let i = 0; i < images.length; i++) {
      images[i].remove()
  }

  return newDiv.innerHTML;
}

function removePromo(readabilityContent) {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = readabilityContent;
    const promotion = newDiv.querySelectorAll(".content");
    for (let i = 0; i < promotion.length; i++) {
        promotion[i].remove()
        
    }
    return newDiv.innerHTML
}

export function cleanRzecz(readabilityContent) {
    let cleaned = removeImages(readabilityContent);
    return removePromo(cleaned)
}

export function cleanRzeczBefore(documentClone) {
  const marketing = documentClone.getElementsByClassName("marketing--comp");
  if (marketing) {
    while (marketing.length > 0) {
      marketing[0].parentNode.removeChild(marketing[0]);
    }
  }
  const articleBlock = documentClone.getElementsByClassName("articleBodyBlock content--excerpt clear-both");
  if (articleBlock) {
    while (articleBlock.length > 0) {
      articleBlock[0].parentNode.removeChild(articleBlock[0]);
    }
  }
  const quote = documentClone.getElementsByClassName("articleBodyBlock excerpt--article center customHeight");
  if (quote) {
    while (quote.length > 0) {
      quote[0].parentNode.removeChild(quote[0]);
    }
  }
  return documentClone;
}
  