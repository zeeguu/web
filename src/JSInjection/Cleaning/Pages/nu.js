export const nuRegex = /^(http|https):\/\/(www.)nu.nl\/.*/;

export function removeNoScript(documentClone) {
    const noscript = documentClone.getElementsByTagName("noscript");
    console.log("noscript", noscript)
        while(noscript.length > 0) {
            let elem = noscript[0];
            console.log("element ", elem)
            console.log(elem.parentElement);
            elem.parentElement.removeChild(elem);
        }
        console.log("loop", documentClone)
        
    return documentClone
}
//not working - whyyyyyy