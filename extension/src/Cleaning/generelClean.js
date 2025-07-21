import { egyszervoltRegex } from "./Pages/egyszervolt";
import { removeAllElementsIfExistent, createDivWithContent  } from "./util";
import { getSourceAsDOM } from "../popup/functions";


export function getMainImage(HTMLContent, url) {
  const currentDOM = getSourceAsDOM(url);
  let articleImage;
  let socialMediaImage = currentDOM.querySelector('meta[property="og:image"]');

  if (socialMediaImage) {
    articleImage = socialMediaImage.content;
  }

  if (articleImage === undefined) {
    const HTMLDiv = createDivWithContent(HTMLContent);
    const images = HTMLDiv.querySelectorAll("img");
    if (images) {
      for (var i = 0; i < images.length; i++) {
        const imgScr = images[i].currentSrc
        const imgAlt = images[i].getAttribute("alt")
        const correctFormat = correctImageFormat(imgScr);
        const websiteIcon = imgScr.includes("cover") || imgScr.includes("placeholder") || imgScr.includes("icon");

        if (images[i].height > 350 && images[i].className.includes("lazy") && !websiteIcon) {
          let image = images[i].dataset.original;
          if (image === undefined) {
            image = images[i].dataset.src;
          }
          articleImage = createImage(imgAlt, image);
          return articleImage;
        } else if (images[i].height > 250 && correctFormat && !websiteIcon) {
          articleImage = createImage(imgAlt, imgScr);
          return articleImage;
        }
        if (url.match(egyszervoltRegex) && images[i].height > 150) {
          articleImage = createImage(imgAlt, imgScr);
          return articleImage;
        }
      }
    }
  } else {
    articleImage = createImage(null, articleImage);
    return articleImage;
  }
}

function createImage(alt, src) {
  const newImage = document.createElement("img");
  newImage.setAttribute("src", src);
  newImage.setAttribute("alt", alt);
  return newImage;
}

function correctImageFormat(imgScr) {
  var lastThreeChar = imgScr.slice(-3);
  if (lastThreeChar === "gif" || lastThreeChar === "svg") {
    return false;
  }
  return true;
}



/*Final cleanup function */
export function generalClean(readabilityContent) {
  let cleanContent = removeSVG(readabilityContent);
  cleanContent = removeLinks(cleanContent);
  cleanContent = removeFigures(cleanContent);
  return cleanContent;
}

/* Functions */
function removeSVG(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsIfExistent("svg", div)
  return div.innerHTML;
}

function removeLinks(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  var links = div.getElementsByTagName("a");
  while (links.length) {
    var parent = links[0].parentNode;
    while (links[0].firstChild) {
      parent.insertBefore(links[0].firstChild, links[0]);
    }
    parent.removeChild(links[0]);
  }
  return div.innerHTML;
}

function removeFigures(readabilityContent) {
  const div = document.createElement("div");
  div.innerHTML = readabilityContent;
  removeAllElementsIfExistent("figure", div)
  return div.innerHTML;
}