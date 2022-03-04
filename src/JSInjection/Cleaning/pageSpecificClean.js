import {btRegex, addImageBT} from "./Pages/bt";
import {wikiRegex, removefromWiki} from "./Pages/wiki";
import { lefigaroRegex, addImageLefirago } from "./Pages/lefigaro";
import { ekstrabladetRegex, addImageEkstraBladet } from "./Pages/ekstrabladet";
import { lemondeRegex, removeListElementsHeaders, removeServices, removeInjectedContent} from "./Pages/lemonde";
import { lexpressRegex, removeasides, unavailableContent } from "./Pages/lexpress";
import { marianneRegex, removeArticleLinks, getImage as getImageMarianne } from "./Pages/marianne";
export function getEntireHTML(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

export function pageSpecificClean(articleContent, url) {
    const div = document.createElement("div");
    div.innerHTML = articleContent;
    if (url.match(wikiRegex)) {
      return removefromWiki(div.innerHTML);
    } 
    if (url.match(btRegex)) {
      return addImageBT(getEntireHTML(url), articleContent)
    }
    if (url.match(lefigaroRegex)) {
      return addImageLefirago(getEntireHTML(url), articleContent)
    }
    if (url.match(ekstrabladetRegex)) {
      return addImageEkstraBladet(getEntireHTML(url), articleContent)
    }
    if (url.match(lemondeRegex)) {
      let lemonde = removeInjectedContent(div.innerHTML)
      return removeListElementsHeaders(removeServices(lemonde))
    }
    if (url.match(lexpressRegex)) {
      let lexpress = unavailableContent(articleContent)
      return removeasides(lexpress)
    }
    if (url.match(marianneRegex)) {
      let wImage = getImageMarianne(articleContent, getEntireHTML(url),)
      return removeArticleLinks(wImage)
    }
    //many other if-statements with checks for urls
    return div.innerHTML
  }


