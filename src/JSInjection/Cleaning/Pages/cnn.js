import { createDivWithContent } from "../util";

export const cnnRegex = /(http|https):\/\/(edition.cnn.com).*/;

export function cleanCNN(HTMLContent, readabilityContent){
  return addImageCNN(HTMLContent, readabilityContent)
}

function addImageCNN(HTMLContent, readabilityContent) {
  const HTMLDiv = createDivWithContent(HTMLContent)
  const div = createDivWithContent(readabilityContent)

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
