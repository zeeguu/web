export const cnnRegex = /(http|https):\/\/(edition.cnn.com).*/;

export function addImageCNN(readabilityContent, HTMLContent) {
  // create a div with content from HTML
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;

  // create a new div with the content from readability
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;
  const image = div.querySelectorAll("[data-src-medium]")[0];
  if (image) {
    const imageDataset = image.dataset;
    if (imageDataset) {
      const srcMediumSize = imageDataset.srcMedium;
      const imageSrc = "https:" + srcMediumSize;
      const imageAlt = image.getAttribute("alt");
      const newImage = document.createElement("img");
      newImage.setAttribute("src", imageSrc);
      newImage.setAttribute("alt", imageAlt);
      newDiv.prepend(newImage);
    }
  }
  return newDiv.innerHTML;
}
