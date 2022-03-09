export const nuRegex = /^(http|https):\/\/(www.)nu.nl\/.*/;

export function removeNoScript(documentClone) {
    const noscript = documentClone.getElementsByTagName("noscript");
    console.log("noscript", noscript)
        for (let i = 0; i< noscript.length; i++) {
            if (noscript[i].parentNode) {
                while (noscript[i].firstChild) {
                    noscript[i].removeChild(noscript[i].firstChild)
                }
            //noscript[i].parentNode.removeChild(noscript[i])
        }
        console.log("loop", documentClone)
        }
    return documentClone
}
