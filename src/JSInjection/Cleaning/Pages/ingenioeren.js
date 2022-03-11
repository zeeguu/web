export const ingenioerRegex = /^(http|https):\/\/ing.dk\/.*/;

function getImageIngenioren(content, html) {
  //search for image in readability content
  let readabilitydiv = document.createElement("div");
  readabilitydiv.innerHTML = content;
  let hasImage = readabilitydiv.getElementsByTagName("img");
  if (hasImage.length === 0) {
    //get image from entire html
    let div = document.createElement("div");
    div.innerHTML = html;
    const images = div.getElementsByClassName("image")[0];
    const image = images.textContent;
    //create new element to insert the noscript textContent into
    let divImg = document.createElement("div");
    divImg.innerHTML = image;
    if (image !== undefined) {
      readabilitydiv.prepend(divImg);
    }
  }
  return readabilitydiv.innerHTML;
}

function removeComments(content, html) {
  //for pages where only comments are displayed
  //content of the article is inside div class=panel-panel panel-col
  let div = document.createElement("div");
  div.innerHTML = content;
  let comments = div.querySelectorAll("article");
  if (comments.length !== 0) {
    let div = document.createElement("div");
    div.innerHTML = html;
    let articleContent = div.getElementsByClassName("panel-panel panel-col")[0];
    let newContent = document.createElement("div");
    newContent.innerHTML = articleContent;
    return articleContent.innerHTML;
  }
  return div.innerHTML;
}
export function ingenioerenClean(content, html) {
  let contentWithImage = getImageIngenioren(content, html);
  contentWithImage = removeComments(contentWithImage, html);
  return contentWithImage;
}
