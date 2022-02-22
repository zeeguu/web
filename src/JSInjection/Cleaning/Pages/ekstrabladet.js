export const ekstrabladetRegex = /^(http|https):\/\/ekstrabladet.dk\/.*/;

export function addImageEkstraBladet(HTMLContent, readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;
  const imageClass = div.getElementsByClassName("figure-image border-radius")[0];

  // create a new div with the content from readability
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;

  // If a main image exists add it to the readability content
  if (imageClass != undefined) {
    const imageAlt = imageClass.getAttribute("alt")
    const image = imageClass.currentSrc
    const newImage = document.createElement("img");
    newImage.setAttribute("src", image);
    newImage.setAttribute("alt", imageAlt);
    newDiv.prepend(newImage);
  }
  return newDiv.innerHTML;
}
