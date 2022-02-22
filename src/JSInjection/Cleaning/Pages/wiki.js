export const wikiRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]wikipedia+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/

export function removefromWiki(content){
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
    content = div.innerHTML;
    return div.innerHTML;
  }
  

  //note to self: måske kan vi også fjerne fodnoter fra wiki
