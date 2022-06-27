import { createDivWithContent } from "../util";

export const lefigaroRegex = /(http|https):\/\/(www.lefigaro.fr).*/;

export function cleanLefigaro(HTMLContent, readabilityContent){
  return addImageLefirago(HTMLContent, readabilityContent)
}

function addImageLefirago(HTMLContent, readabilityContent) {
  // create new div with raw HTML content from the entire webpage
  const HTMLDiv = createDivWithContent(HTMLContent)
  const imageClass = HTMLDiv.querySelector(".fig-media-photo");

  // create a new div with the content from readability
  const div = createDivWithContent(readabilityContent)

  // If a main image exists add it to the readability content
  if (imageClass != undefined) {
    const imageAlt = imageClass.getAttribute("alt")
    const image = imageClass.currentSrc
    const newImage = document.createElement("img");
    newImage.setAttribute("src", image);
    newImage.setAttribute("alt", imageAlt);
    div.prepend(newImage);
  }
  return div.innerHTML;
}
