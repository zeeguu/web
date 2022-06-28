import { createDivWithContent, removeAllElementsIfExistent } from "../util"

export const wikiRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]wikipedia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

export function cleanWiki(readabilityContent){
    let cleanedContent = removeText(readabilityContent)
    cleanedContent = removeTable(cleanedContent)
    return cleanedContent
  }

  function removeText(readabilityContent){
    const div = createDivWithContent(readabilityContent)
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

  function removeTable(readabilityContent) {
    const div = createDivWithContent(readabilityContent)
    removeAllElementsIfExistent("table", div)
    return div.innerHTML;
  }