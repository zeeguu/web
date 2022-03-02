import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText"

export function interactiveTextsWithTags(content, articleInfo, api) {
    const div = document.createElement("div");
    div.innerHTML = content;
    let arrOfInteractive = [];
    let allTags = div.getElementsByTagName("*");
    for (let i = 0; i < allTags.length; i++) {
      const content = allTags[i].textContent;
      const HTMLTag = allTags[i].nodeName;
      if ((HTMLTag === "OL") ||( HTMLTag === "UL")){
        const children = Array.from(allTags[i].children)
        let list = [];
        children.forEach(child => {
          const content = child.textContent;
          const it = new InteractiveText(content, articleInfo, api)
          const paragraphObject = {text: it}
          list.push(paragraphObject)
        });
        const paragraphObject = {tag:HTMLTag, list: list}
        arrOfInteractive.push(paragraphObject);
      }
      else{
      const it = new InteractiveText(content, articleInfo, api);
      const paragraphObject = {text: it, tag:HTMLTag}
      arrOfInteractive.push(paragraphObject);
      }
    }
    return arrOfInteractive;
  }


    /*
  convert 
  output = ""
  for each in children
  if each is a textnode
  then create an interactive text and append it to the list of interactive texts
  if its not (just an container)
  each is containter of text
  output append (each tag)
  convert(on the children)
  
  */
