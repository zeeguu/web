export const drRegex =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]dr+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

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
