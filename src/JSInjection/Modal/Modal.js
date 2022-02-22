import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";
import InteractiveHTML from "./reader/InteractiveHTML";
import { TranslatableText } from "./reader/TranslatableText";
import { getImage } from "../Cleaning/generelClean";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };

  function mapTags(content, articleInfo, api) {
    const div = document.createElement("div");
    div.innerHTML = content;
    let arrOfInteractive = [];
    var allTags = div.getElementsByTagName("*");
    for (var i = 0, len = allTags.length; i < len; i++) {
      const content = allTags[i].textContent;
      let it = new InteractiveHTML(content, articleInfo, api, allTags[i].nodeName);
      // allTags[i].id is the id of the element (if there is one)
      arrOfInteractive.push(it);
    }
    return arrOfInteractive;
  }

  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [articleImage, setArticleImage] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const [contentArray, setContentArray] = useState();

  useEffect(() => {
    let articleInfo = {
      url: "http://test.it/articleurl",
      content: "This is content",
      id: "11833417",
      title: title,
      language: "da",
      starred: true,
    };

    let image = getImage(content)
    setArticleImage(image)
    let arrInteractive = mapTags(content, articleInfo, api);
    setInteractiveText(arrInteractive);
    let itTitle = new InteractiveHTML(title, articleInfo, api);
    setInteractiveTitle(itTitle);
  }, []);
  
  if (interactiveText === undefined) {
    return <p>loading</p>;
  }
  return (
    <div>
      {console.log(interactiveText)}
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
        {interactiveText.map((text) => {
            if ((text.tag === "P") || (text.tag === "H3") || (text.tag === "H2") || (text.tag === "H4") || (text.tag === "H5")){
            const CustomTag = `${text.tag}`;
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={text}
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
