export function readableDR(HTMLContent) {
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;
  //Check if it is a live article
  const liveArticle = div.getElementsByClassName("lc-feed-container");
  if (liveArticle.length > 0) {
    return false;
  }
  //Check if it is a gallery article
  const galleryArticle = div.getElementsByClassName("dre-photo-feature-article");
  if (galleryArticle.length > 0) {
    return false;
  } else {
    return true;
  }
}