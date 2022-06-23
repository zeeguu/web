export const ingenioerRegex = /^(http|https):\/\/ing.dk\/.*/;
function removeComments(content, html) {
  //for pages where only comments are displayed
  //content of the article is inside div class=panel-panel panel-col
  let div = document.createElement("div");
  div.innerHTML = content;
  let comments = div.querySelectorAll("article");
  if(comments){
  if (comments.length !== 0) {
    let div = document.createElement("div");
    div.innerHTML = html;
    let articleContent = div.getElementsByClassName("panel-panel panel-col")[0];
    let newContent = document.createElement("div");
    newContent.innerHTML = articleContent;
    return articleContent.innerHTML;
  }}
  return div.innerHTML;
}
export function ingenioerenClean(content, html) {
  let cleanedContent = removeComments(content, html);
  return cleanedContent;
}
