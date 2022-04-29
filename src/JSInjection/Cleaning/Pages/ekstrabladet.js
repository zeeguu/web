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
    const imageAlt = imageClass.getAttribute("alt");
    const image = imageClass.currentSrc;
    const newImage = document.createElement("img");
    newImage.setAttribute("src", image);
    newImage.setAttribute("alt", imageAlt);
    newDiv.prepend(newImage);
  }
  return newDiv.innerHTML;
}

export function removePrefix(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  const header = div.getElementsByTagName("header")[0];
  if (header) {
    let firstDiv = header.getElementsByTagName("div")[0];
    if (firstDiv) {
      firstDiv.remove();
    }
  }
  return div.innerHTML;
}

export function ekstraBladetClean(HTMLContent, readabilityContent) {
  const removedDate = removePrefix(readabilityContent);
  let cleaned = addImageEkstraBladet(HTMLContent, removedDate);
  cleaned = removeFigure(cleaned);
  return cleaned;
}

export function removeFigure(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  const figure = div.getElementsByTagName("figure");
  if (figure) {
    while (figure.length > 0) {
      figure[0].parentNode.removeChild(figure[0]);
    }
  }
  return div.innerHTML;
}

export function cleanEkstraBladetBefore(documentClone) {
  const splitElement = documentClone.getElementsByClassName(
    "d-block is-breakout--wide split-element--ekstra"
  );
  if (splitElement) {
    while (splitElement.length > 0) {
      splitElement[0].parentNode.removeChild(splitElement[0]);
    }
  }
  const videoElement =
    documentClone.getElementsByClassName("jw-video jw-reset");
  if (videoElement) {
    while (videoElement.length > 0) {
      videoElement[0].parentNode.removeChild(videoElement[0]);
    }
  }
  const imageElement = documentClone.getElementsByClassName(
    "figure image-container"
  );
  if (imageElement) {
    while (imageElement.length > 0) {
      imageElement[0].parentNode.removeChild(imageElement[0]);
    }
  }
  let elems = documentClone.querySelectorAll("p");
  Array.from(elems).filter((p) =>
    p.textContent.includes("Artiklen fortsætter under") ? p.remove() : p
  );
  return documentClone;
}
