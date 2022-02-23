import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";
import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText"
//import { TranslatableText } from "./reader/TranslatableText";
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText"
import { getImage } from "../Cleaning/generelClean";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api, url }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };


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
  function mapTags(content, articleInfo, api) {
    const div = document.createElement("div");
    div.innerHTML = content;
    let arrOfInteractive = [];
    var allTags = div.getElementsByTagName("*");
    for (var i = 0, len = allTags.length; i < len; i++) {
      const content = allTags[i].textContent;
      const HTMLTag = allTags[i].nodeName;
      let it = new InteractiveText(content, articleInfo, api);
      // allTags[i].id is the id of the element (if there is one)
      const paragraphObject = {text: it, tag:HTMLTag}
      arrOfInteractive.push(paragraphObject);
    }
    return arrOfInteractive;
  }

  const [interactiveTextArray, setInteractiveTextArray] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [articleImage, setArticleImage] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);

  useEffect(() => {
    let articleInfo = {
      url: url,
      content: content,
      id: "11833417",
      title: title,
      language: "da",
      starred: false,
    };
    let image = getImage(content)
    setArticleImage(image)

    let arrInteractive = mapTags(content, articleInfo, api);
    setInteractiveTextArray(arrInteractive);

    let itTitle = new InteractiveText(title, articleInfo, api);
    setInteractiveTitle(itTitle);
  }, []);
  
  if (interactiveTextArray === undefined) {
    return <p>loading</p>;
  }
  return (
    <div>
      <StyledModal
        isOpen={modalIsOpen}
        className="Modal"
        overlayClassName="Overlay"
      >
        <StyledButton onClick={handleClose} id="qtClose">
          X
        </StyledButton>
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        {articleImage === undefined ? null : <img id="zeeguuImage" alt={articleImage.alt} src={articleImage.src}></img>}
        {interactiveTextArray.map((paragraph) => {
            if ((paragraph.tag === "P") || (paragraph.tag === "H3") || (paragraph.tag === "H2") || (paragraph.tag === "H4") || (paragraph.tag === "H5")){
            const CustomTag = `${paragraph.tag}`;
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={paragraph.text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
              </CustomTag>
            )}
        })}
      </StyledModal>
    </div>
  );
}
