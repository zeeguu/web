export const egyszervoltRegex = /(http|https):\/\/(egyszervolt.hu).*/;

export function removeIMGTag(content) {
    const div = document.createElement("div");
    div.innerHTML = content;
    let image = div.getElementsByTagName("img")[0];
    if(image){
        image.remove();
        div.appendChild(image);
    }
    return div.innerHTML
  }
  