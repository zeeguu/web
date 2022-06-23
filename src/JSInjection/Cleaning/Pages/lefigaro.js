export const lefigaroRegex = /(http|https):\/\/(www.lefigaro.fr).*/;

function addImageLefirago(HTMLContent, readabilityContent) {
  // create new div with raw HTML content from the entire webpage
  const HTMLDiv = document.createElement("div");
  HTMLDiv.innerHTML = HTMLContent;
  const imageClass = HTMLDiv.querySelector(".fig-media-photo");

  // create a new div with the content from readability
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;

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

export function cleanLefigaro(HTMLContent, readabilityContent){
  return addImageLefirago(HTMLContent, readabilityContent)
}