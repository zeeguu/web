import { createDivWithContent, removeFirstElementIfExistent } from "../util";

export const btRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]bt+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export function cleanBT(HTMLContent, readabilityContent) {
  let cleanedContent = addImageBT(HTMLContent, readabilityContent);
  cleanedContent = removeTTSNotice(cleanedContent);
  return cleanedContent;
}

function addImageBT(HTMLContent, readabilityContent) {
  const HTMLDiv = createDivWithContent(HTMLContent)
  const div = createDivWithContent(readabilityContent)
  const imageClass = HTMLDiv.querySelector(".article-image-main");
  // If a main image exists add it to the readability content - else see if a static image from the mediaplayer exists and add it to the readability content
  if (imageClass != undefined) {
    const image = imageClass.querySelector("img");
    div.prepend(image);
  } else {
    const videoContent = div.querySelector(".mediaplayer");
    if (videoContent != undefined) {
      var videoContentString = document.createTextNode(videoContent.textContent).wholeText;
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
      if (videoContentString.match(urlRegex)) {
        const newImg = document.createElement("img");
        newImg.src = videoContentString.match(urlRegex);
        div.prepend(newImg);
      }
    }
  }
  return div.innerHTML;
}

function removeTTSNotice(readabilityContent) {
  const div = createDivWithContent(readabilityContent);
  ["#tts-notice", "#tts-shift", "#tts-consent-box"].forEach((id) => {
    removeFirstElementIfExistent(id, div);
  });
  return div.innerHTML;
}