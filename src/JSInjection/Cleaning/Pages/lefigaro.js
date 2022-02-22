export const lefigaroRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]lefigaro+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function addImageLefirago(HTMLContent, readabilityContent) {
  // create new div with raw HTML content from the entire webpage
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;
  const imageClass = div.getElementsByClassName("fig-media-photo")[0];

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
