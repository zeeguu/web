export const spiegelRegex = /(http|https):\/\/(www\.spiegel\.de).*/;

export function cleanSpiegelBefore(documentClone) {
    let stickyInfo = documentClone.getElementsByClassName("sticky")
    let figcaptions = documentClone.querySelectorAll("figcaption")
    for (let i = 0; i < stickyInfo.length; i++){
            stickyInfo[i].remove()
    }
    for (let i = 0; i < figcaptions.length; i++){
        figcaptions[i].remove()
    }
    return documentClone
}
