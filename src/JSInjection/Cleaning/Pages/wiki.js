import { removeAllElementsIfExistent } from "../util"

export const wikiRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]wikipedia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

export function removefromWiki(HTMLContent, content){
    let cleanedContent = removeText(content)
    cleanedContent = removeTable(cleanedContent)
    cleanedContent = getWikiImage(HTMLContent, cleanedContent)
    return cleanedContent
  }

  function removeText(content){
    const div = document.createElement("div");
    div.innerHTML = content;
    let elems = div.querySelectorAll("span")
    Array.from(elems).filter(span => span.textContent.includes('edit source') ? span.remove() : span);
    Array.from(elems).filter(span => span.textContent.includes('rediger kildetekst') ? span.remove() : span);
    Array.from(elems).filter(span => span.textContent.includes('Quelltext bearbeiten') ? span.remove() : span);
    Array.from(elems).filter(span => span.textContent.includes('modifier le code') ? span.remove() : span);
    Array.from(elems).filter(span => span.textContent.includes('redigera') ? span.remove() : span);
    Array.from(elems).filter(span => span.textContent.includes('edit') ? span.remove() : span);
    let smallElems = div.querySelectorAll("small")
    Array.from(smallElems).filter(small => small.textContent.includes('redigér på Wikidata') ? small.remove() : small);
    let references = div.querySelectorAll("sup")
    Array.from(references).filter(references => references.remove());
    let dl = div.querySelectorAll("dl")
    Array.from(dl).filter(dl => dl.remove());
    return div.innerHTML;
  }

  function removeTable(content) {
    const div = document.createElement("div");
    div.innerHTML = content;
    removeAllElementsIfExistent("table", div)
    return div.innerHTML;
  }

  function getWikiImage(HTMLContent, readabilityContent) {
    const htmlDIV = document.createElement("div");
    htmlDIV.innerHTML = HTMLContent;
    const images = htmlDIV.querySelectorAll("img")

    // create a new div with the content from readability
    const div = document.createElement("div");
    div.innerHTML = readabilityContent;

    for (var i = 0; i < images.length; i++) {
      if (images[i].height > 200) {
        const imageAlt = images[i].getAttribute("alt")
        const image = images[i].currentSrc
        const newImage = document.createElement("img");
        newImage.setAttribute("src", image);
        newImage.setAttribute("alt", imageAlt);
        div.prepend(newImage);
        break;
      } 
    }
    return div.innerHTML;
  }