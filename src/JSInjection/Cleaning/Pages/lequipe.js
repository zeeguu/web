export const leqiupeRegex = /(http|https):\/\/(www.lequipe.fr).*/;

export function getLequipeImage(content, html) {
  const div = document.createElement("div");
  div.innerHTML = content;
  const divHTML = document.createElement("div");
  divHTML.innerHTML = html;
  const imageClass = divHTML.getElementsByClassName("Image__content")[0];
  const firstImage = imageClass.getElementsByTagName("img")[0];
  if (firstImage !== undefined) {
    const imageAlt = firstImage.getAttribute("alt");
    const image = firstImage.getAttribute("src");
    const newImage = document.createElement("img");
    newImage.setAttribute("src", image);
    newImage.setAttribute("alt", imageAlt);
    div.prepend(newImage);
  }
  return div.innerHTML;
}

//before clean:
export function removeDateTime(documentClone) {
  const authorinfo = documentClone.getElementsByClassName("Author__infos");
  if (authorinfo) {
    while (authorinfo.length > 0) {
      authorinfo[0].parentNode.removeChild(authorinfo[0]);
    }
  }
  return documentClone;
}
