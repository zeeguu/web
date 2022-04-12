import { btRegex, addImageBT } from "./Pages/bt";
import { wikiRegex, removefromWiki} from "./Pages/wiki";
import { lefigaroRegex, addImageLefirago } from "./Pages/lefigaro";
import { ekstrabladetRegex, ekstraBladetClean, cleanEkstraBladetBefore } from "./Pages/ekstrabladet";
import { lemondeRegex, removeAuthorDetail, cleanLemonde} from "./Pages/lemonde";
import { drRegex, cleanDRBefore} from "./Pages/dr";
import { cleanLexpress, lexpressRegex } from "./Pages/lexpress";
import { marianneRegex, cleanMarianne} from "./Pages/marianne";
import { ingenioerenClean, ingenioerRegex} from "./Pages/ingenioeren";
import { nuRegex, removeBlockTitle } from "./Pages/nu";
import { getLequipeImage, leqiupeRegex, removeDateTime } from "./Pages/lequipe";
import { berlingskeRegex, cleanBerlingske, cleanBerlingskeBefore } from "./Pages/berlingske";
import {spiegelRegex, cleanSpiegelBefore} from "./Pages/spiegel"
import { addImageCNN, cnnRegex } from "./Pages/cnn";
import { bbcRegex, cleanBBC } from "./Pages/bbc";
import { cleanExpressBefore, expressRegex } from "./Pages/express";
import { cleanWyborcza, wyborczaRegex } from "./Pages/wyborcza";
import { cleanFakt, faktRegex } from "./Pages/fakt";

export function getEntireHTML(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

export function pageSpecificClean(articleContent, url) {
    if (url.match(wikiRegex)) {
      return removefromWiki(getEntireHTML(url), articleContent);
    } 
    if (url.match(btRegex)) {
      return addImageBT(getEntireHTML(url), articleContent)
    }
    if (url.match(lefigaroRegex)) {
      return addImageLefirago(getEntireHTML(url), articleContent)
    }
    if (url.match(ekstrabladetRegex)) {
      return ekstraBladetClean(getEntireHTML(url), articleContent)
    }
    if (url.match(lemondeRegex)) {
       return cleanLemonde(articleContent)
    }
    if (url.match(lexpressRegex)) {
      return cleanLexpress(articleContent)
    }
    if (url.match(marianneRegex)) {
      return cleanMarianne(articleContent, getEntireHTML(url))
    }
    if (url.match(ingenioerRegex)) {
      return ingenioerenClean(articleContent, getEntireHTML(url))
    }
    if (url.match(leqiupeRegex)) {
      return getLequipeImage(articleContent, getEntireHTML(url))
    }
    if (url.match(berlingskeRegex)) {
      return cleanBerlingske(articleContent)
    }
    if(url.match(cnnRegex)){
      return addImageCNN(articleContent, getEntireHTML(url))
    }
    if(url.match(bbcRegex)){
      return cleanBBC(articleContent)
    }
    if(url.match(wyborczaRegex)){
      return cleanWyborcza(articleContent)
    }
    return articleContent;
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
    if(currentTabURL.match(ekstrabladetRegex)){
      return cleanEkstraBladetBefore(documentClone)
    }
    if (currentTabURL.match(leqiupeRegex)) {
      return removeDateTime(documentClone);
    }
    if (currentTabURL.match(berlingskeRegex)) {
      return cleanBerlingskeBefore(documentClone)
    }
    if(currentTabURL.match(spiegelRegex)){
      return cleanSpiegelBefore(documentClone)
    }
    if(currentTabURL.match(expressRegex)){
      return cleanExpressBefore(documentClone)
    }
    if(currentTabURL.match(faktRegex)){
      return cleanFakt(documentClone)
    }
    return documentClone
  }
  


