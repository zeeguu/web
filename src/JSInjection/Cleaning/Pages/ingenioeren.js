import { getHTMLContent } from "../pageSpecificClean";
import { createDivWithContent } from "../util";

export const ingenioerRegex = /^(http|https):\/\/ing.dk\/.*/;

export function cleanIngenioeren(readabilityContent, url) {
  const HTMLContent = getHTMLContent(url)
  let cleanedContent = removeComments(HTMLContent, readabilityContent);
  return cleanedContent;
}

function removeComments(HTMLContent, readabilityContent) {
  //for pages where only comments are displayed
  //content of the article is inside div class=panel-panel panel-col
  const div = createDivWithContent(readabilityContent)
  let comments = div.querySelectorAll("article");
  if(comments){
  if (comments.length !== 0) {
    let HTMLDiv = createDivWithContent(HTMLContent)
    let articleContent = HTMLDiv.getElementsByClassName("panel-panel panel-col")[0];
    let newContent = document.createElement("div");
    newContent.innerHTML = articleContent;
    return newContent.innerHTML;
  }}
  return div.innerHTML;
}
