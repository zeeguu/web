export const marianneRegex = /(http|https):\/\/(www\.marianne\.net).*/;

function removeArticleLinks(content) {
    let div = document.createElement("div");
    div.innerHTML = content;
    let elements = div.getElementsByTagName("p");
    for (let i = 0; i < elements.length; i++){
        if (elements[i].textContent.includes("À LIRE AUSSI")) {
            elements[i].remove()
        }
    }
    return div.innerHTML;
    
}

function getImageMarianne(content, html) {
    //search for image in readability content
    let readabilitydiv = document.createElement("div");
    readabilitydiv.innerHTML = content;
    let hasImage = readabilitydiv.getElementsByTagName("img");
    if (hasImage.length === 0) {
        //get image from entire html
        let div = document.createElement("div");
        div.innerHTML = html;
        const images = div.getElementsByClassName("article__image article__item")[0];
        const image = images.getElementsByTagName("img");
        if (image !== undefined) {
            readabilitydiv.prepend(image[0])
        }
    }
    return readabilitydiv.innerHTML

}

export function cleanMarianne(content, html) {
    let cleanedContent = removeArticleLinks(content);
    cleanedContent = getImageMarianne(cleanedContent, html);
    return cleanedContent;
}