/*Final cleanup function */
export function generalClean(content) {
  let cleanContent = removeSVG(content);
  cleanContent = removeLinks(cleanContent);
  cleanContent = removeFigcaption(cleanContent);
  return cleanContent

}

/* Functions */
export function getImage(content) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const firstImage = div.getElementsByTagName("img")[0];
  if((firstImage != undefined)){
  const image = {src:firstImage.getAttribute("src"), alt:firstImage.getAttribute("alt")};
  return image
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


function removeFigcaption(content){
  const div = document.createElement("div");
  div.innerHTML = content;
  const figcaption = div.getElementsByTagName("figcaption");
  if (figcaption  !== undefined) {
    let caption = figcaption ,
      index;
    for (index = caption.length - 1; index >= 0; index--) {
      caption[index].parentNode.removeChild(caption[index]);
    }
    content = div.innerHTML;
  }
  return content;
}






