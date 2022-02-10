export function removeSVG(content) {
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