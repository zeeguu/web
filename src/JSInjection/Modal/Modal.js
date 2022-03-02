import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";
import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText"
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText"
import { getImage } from "../Cleaning/generelClean";
import { interactiveTextsWithTags } from "./interactivityFunctions";
import { getNativeLanguage } from "../../popup/functions";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api, url, language }) {

  const [interactiveTextArray, setInteractiveTextArray] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [articleImage, setArticleImage] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const [articleId, setArticleId] = useState();
  const [nativeLang, setNativeLang] = useState();

  useEffect(() => {
    let articleInfo = {
      url: url,
      content: content,
      id: articleId,
      title: title,
      language: language,
      starred: false,
    };
    let image = getImage(content);
    setArticleImage(image);

    let arrInteractive = interactiveTextsWithTags(content, articleInfo, api);
    setInteractiveTextArray(arrInteractive);

    let itTitle = new InteractiveText(title, articleInfo, api);
    setInteractiveTitle(itTitle);
  }, []);

  useEffect(() => {
    if (content != undefined) {
      let info = {
        url: url,
        htmlContent: content,
        title: title,
      };
      api.findCreateArticle(info, (articleId) => setArticleId(articleId));
    }
    getNativeLanguage().then((result)=>
      setNativeLang(result)
    )
  }, []);

localStorage.setItem("native_language", nativeLang)

const handleClose = () => {
  location.reload();
  setModalIsOpen(false);
};
  
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
            const CustomTag = `${paragraph.tag}`;
            if ((paragraph.tag === "P") || (paragraph.tag === "H3") || (paragraph.tag === "H2") || (paragraph.tag === "H4") || (paragraph.tag === "H5")){
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={paragraph.text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
              </CustomTag>
            )}
          if((paragraph.tag ==="OL") || (paragraph.tag ==="UL")){
            let list = Array.from(paragraph.list)
            return (
              <CustomTag>
              {list.map((paragraph, i) => {
                return(
                <li key={i}>
                <TranslatableText
                  interactiveText={paragraph.text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
                </li>)})}
                </CustomTag>
            )
         
          }
        })}
      </StyledModal>
    </div>
  );
}
