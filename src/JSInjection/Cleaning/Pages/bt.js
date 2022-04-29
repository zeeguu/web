export const btRegex =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]bt+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function addImageBT(HTMLContent, readabilityContent) {
  // create new div with raw HTML content from the entire webpage
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;
  const imageClass = div.getElementsByClassName("article-image-main")[0];

  // create a new div with the content from readability
  const newDiv = document.createElement("div");
  newDiv.innerHTML = readabilityContent;

  // If a main image exists add it to the readability content - else see if a static image from the mediaplayer exists and add it to the readability content
  if (imageClass != undefined) {
    const image = imageClass.getElementsByTagName("img")[0];
    newDiv.prepend(image);
  } else {
    const videoContent = div.getElementsByClassName("mediaplayer")[0];
    if (videoContent != undefined) {
      var videoContentString = document.createTextNode(videoContent.textContent).wholeText;
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      if (videoContentString.match(urlRegex)) {
        const newImg = document.createElement("img");
        newImg.src = videoContentString.match(urlRegex);
        newDiv.prepend(newImg);
      }
    }
  }
  return newDiv.innerHTML;
}
