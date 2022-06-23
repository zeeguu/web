export function getImage(cleanedContent) {
  const div = document.createElement("div");
  div.innerHTML = cleanedContent;
  const firstImage = div.getElementsByTagName("img")[0];
  if (firstImage != undefined) {
    const image = {
      src: firstImage.getAttribute("src"),
      alt: firstImage.getAttribute("alt"),
    };
    return image;
  }
}

/*Final cleanup function */
export function generalClean(readabilityContent) {
  let cleanContent = removeSVG(readabilityContent);
  cleanContent = removeLinks(cleanContent);
  cleanContent = removeFigures(cleanContent);
  return cleanContent;
}

/* Functions */
function removeSVG(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let allSVG = div.getElementsByTagName("svg"),
    index;
  if (allSVG.length > 0) {
    for (index = allSVG.length - 1; index >= 0; index--) {
      allSVG[index].parentNode.removeChild(allSVG[index]);
    }
  }
  return div.innerHTML;
}

function removeLinks(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  var links = div.getElementsByTagName("a");
  while (links.length) {
    var parent = links[0].parentNode;
    while (links[0].firstChild) {
      parent.insertBefore(links[0].firstChild, links[0]);
    }
    parent.removeChild(links[0]);
  }
  return div.innerHTML;
}

function removeFigures(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  let figures = div.getElementsByTagName("figure"),
    index;
  if (figures.length > 1) {
    for (index = figures.length - 1; index >= 0; index--) {
      if (index !== 0) {
        figures[index].parentNode.removeChild(figures[index]);
      }
    }
  }
  return div.innerHTML;
}