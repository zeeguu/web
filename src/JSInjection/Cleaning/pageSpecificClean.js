import {wikiRegex, removefromWiki} from "./Pages/wiki";

export function pageSpecificClean(articleContent, url) {
    const div = document.createElement("div");
    div.innerHTML = articleContent;
    if (url.match(wikiRegex)) {
      return removefromWiki(div.innerHTML);
    } 
    //many other if-statements with checks for urls
    return div.innerHTML
  }