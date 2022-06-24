export const cnnRegex = /(http|https):\/\/(edition.cnn.com).*/;

export function addImageCNN(HTMLContent, readabilityContent) {
  // create a div with content from HTML
  const HTMLDiv = document.createElement("div");
  HTMLDiv.innerHTML = HTMLContent;

  // create a new div with the content from readability
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  const image = HTMLDiv.querySelector("[data-src-medium]");
  if (image) {
    const imageDataset = image.dataset;
    if (imageDataset) {
      const srcMediumSize = imageDataset.srcMedium;
      const imageSrc = "https:" + srcMediumSize;
      const imageAlt = image.getAttribute("alt");
      const newImage = document.createElement("img");
      newImage.setAttribute("src", imageSrc);
      newImage.setAttribute("alt", imageAlt);
      div.prepend(newImage);
    }
  }
  return div.innerHTML;
}

export function cleanCNN(HTMLContent, readabilityContent){
  return addImageCNN(HTMLContent, readabilityContent)
}