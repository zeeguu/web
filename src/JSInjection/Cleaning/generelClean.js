/*Final cleanup function */
export function generalClean(content) {
  let cleanContent = removeSVG(content);
  cleanContent = removeLinks(cleanContent);
  cleanContent = removeFigures(cleanContent);
  return cleanContent;
}

/* Functions */
export function getImage(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const firstImage = div.getElementsByTagName("img")[0];
  if (firstImage != undefined) {
    const image = {
      src: firstImage.getAttribute("src"),
      alt: firstImage.getAttribute("alt"),
    };
    return image;
  }
}

function removeSVG(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const allSVG = div.getElementsByTagName("svg");
  if (allSVG !== undefined) {
    let svg = allSVG,
      index;
    for (index = svg.length - 1; index >= 0; index--) {
      svg[index].parentNode.removeChild(svg[index]);
    }
    content = div.innerHTML;
  }
  return content;
}

function removeLinks(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  var links = div.getElementsByTagName("a");
  while (links.length) {
    var parent = links[0].parentNode;
    while (links[0].firstChild) {
      parent.insertBefore(links[0].firstChild, links[0]);
    }
    parent.removeChild(links[0]);
  }
  content = div.innerHTML;
  return content;
}

function removeFigures(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  let figures = div.getElementsByTagName("figure"),
    index;
  if (figures.length > 1) {
    for (index = figures.length - 1; index >= 0; index--) {
      if (index !== 0) {
        figures[index].parentNode.removeChild(figures[index]);
      }
    }
  }
  content = div.innerHTML;
  return content;
}