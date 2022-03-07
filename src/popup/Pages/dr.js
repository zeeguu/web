export function liveArticleDR(HTMLContent) {
  const div = document.createElement("div");
  div.innerHTML = HTMLContent;
  if (div.innerHTML.indexOf("livecenter") !== -1) {
    return false
  }
  else {
    return true
  }
}
