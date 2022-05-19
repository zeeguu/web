export const faktRegex = /(http|https):\/\/(www.fakt.pl).*/;

export function cleanFakt(documentClone) {
  const imageText = documentClone.getElementsByClassName("article-gallery-p");
  if (imageText) {
    while (imageText.length > 0) {
      imageText[0].parentNode.removeChild(imageText[0]);
    }
  }
  const imageNumber = documentClone.getElementsByClassName("article-gallery-counter");
  if (imageNumber) {
    while (imageNumber.length > 0) {
      imageNumber[0].parentNode.removeChild(imageNumber[0]);
    }
  }
  const contactInfo = documentClone.getElementsByClassName("article-contact");
  if (contactInfo) {
    while (contactInfo.length > 0) {
      contactInfo[0].parentNode.removeChild(contactInfo[0]);
    }
  }
  return documentClone;
}


export function removeIFrames(){
  const otherArticles = document.getElementById("slot-flat-plista");
  if (otherArticles) {
    otherArticles.remove()
  }
  const iframe = document.querySelectorAll("iframe");
  if (iframe) {
    for (let i = 0; i < iframe.length; i++) {
      iframe[i].remove();
    }
  }
}
