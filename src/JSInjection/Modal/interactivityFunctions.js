import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText"
import { HEADER_CONTENT, LIST_CONTENT } from "../constants";
export function interactiveTextsWithTags(content, articleInfo, api) {
  const div = document.createElement("div");
  div.innerHTML = content;
  let arrOfInteractive = [];
  let allTags = div.getElementsByTagName("*");

  for (let i = 0; i < allTags.length; i++) {
    const content = allTags[i].textContent;
    const HTMLTag = allTags[i].nodeName;
    if(allTags[i].innerHTML != ""){
    if (LIST_CONTENT.includes(HTMLTag)) {
      const children = Array.from(allTags[i].children);
      let list = [];
      children.forEach((child) => {
        if (child.innerHTML !== "") {
        child.innerHTML = child.innerHTML
          .replaceAll(/<\/?p>|<\/?h[1-6]>/g, "")
          .replaceAll("•", "")
          .replaceAll("-", "");
        const content = child.textContent;
        const it = new InteractiveText(content, articleInfo, api);
        const paragraphObject = { text: it };
        list.push(paragraphObject);
      }});
      const paragraphObject = { tag: HTMLTag, list: list };
      arrOfInteractive.push(paragraphObject);
    } else if (HEADER_CONTENT.includes(HTMLTag)) {
      allTags[i].innerHTML = allTags[i].innerHTML
        .replaceAll(/<\/?p>/g, "")
      const it = new InteractiveText(content, articleInfo, api);
      const paragraphObject = { text: it, tag: HTMLTag };
      arrOfInteractive.push(paragraphObject);
    } else {
      const it = new InteractiveText(content, articleInfo, api);
      const paragraphObject = { text: it, tag: HTMLTag };
      arrOfInteractive.push(paragraphObject);
      }
    }
  }
  return arrOfInteractive;
}

