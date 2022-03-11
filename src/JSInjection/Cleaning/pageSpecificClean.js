import { btRegex, addImageBT } from "./Pages/bt";
import { wikiRegex, removefromWiki } from "./Pages/wiki";
import { lefigaroRegex, addImageLefirago } from "./Pages/lefigaro";
import { ekstrabladetRegex, addImageEkstraBladet } from "./Pages/ekstrabladet";
import { lemondeRegex, removeAuthorDetail, cleanLemonde} from "./Pages/lemonde";
import { drRegex, cleanDR, cleanDRBefore} from "./Pages/dr";
import { cleanLexpress, lexpressRegex } from "./Pages/lexpress";
import { marianneRegex, cleanMarianne} from "./Pages/marianne";
import { ingenioerenClean, ingenioerRegex} from "./Pages/ingenioeren";
import { nuRegex, removeBlockTitle } from "./Pages/nu";
import { getLequipeImage, leqiupeRegex, removeDateTime } from "./Pages/lequipe";
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
      return cleanLemonde(articleContent)
    }
    if(url.match(drRegex)){
      return cleanDR(articleContent)
    }
    if (url.match(lexpressRegex)) {
      return cleanLexpress(div.innerHTML)
    }
    if (url.match(marianneRegex)) {
      return cleanMarianne(div.innerHTML, getEntireHTML(url))
    }
    if (url.match(ingenioerRegex)) {
      return ingenioerenClean(articleContent, getEntireHTML(url))
    }
    if (url.match(leqiupeRegex)) {
      return getLequipeImage(articleContent, getEntireHTML(url))
    }
    return div.innerHTML
  }

  export function cleanDocumentClone(documentClone, currentTabURL) {
    if (currentTabURL.match(drRegex)) {
      return cleanDRBefore(documentClone)
    }
    if (currentTabURL.match(lemondeRegex)) {
      return removeAuthorDetail(documentClone)
    }
    if (currentTabURL.match(nuRegex)) {
      return removeBlockTitle(documentClone)
    }
    // if (currentTabURL.match(lexpressRegex)) {
    //    return removeCaption(documentClone) 
    // }
    if (currentTabURL.match(leqiupeRegex)) {
      return removeDateTime(documentClone);
    }
    return documentClone
  }
  


