/*global chrome*/
import { useEffect, useState } from "react";
import { StyledModal, StyledCloseButton, StyledHeading, StyledButton, GlobalStyle } from "./Modal.styles";
import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText"
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText"
import { getImage } from "../Cleaning/generelClean";
import { interactiveTextsWithTags } from "./interactivityFunctions";
import { getNativeLanguage } from "../../popup/functions";
import ZeeguuLoader from "../ZeeguuLoader";
import { EXTENSION_SOURCE } from "../constants";
import ToolbarButtons from "./ToolbarButtons";
import * as s from "../../zeeguu-react/src/reader/ArticleReader.sc";
import strings from "../../zeeguu-react/src/i18n/definitions";
import {onScroll, onBlur, onFocus, toggle} from "../../zeeguu-react/src/reader/ArticleReader";


export function Modal({ title, content, modalIsOpen, setModalIsOpen, api, url, language, author }) {
  const [interactiveTextArray, setInteractiveTextArray] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [articleImage, setArticleImage] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const [articleId, setArticleId] = useState();
  const [nativeLang, setNativeLang] = useState();
  const [DBArticleInfo, setDBArticleInfo] = useState();
  const [articleLanguage, setArticleLanguage] = useState();
 
  useEffect(() => {
    if (content !== undefined) {
      let info = {
        url: url,
        htmlContent: content,
        title: title,
        authors: author,
      };
      api.findOrCreateArticle(info, (result_dict) =>
        setDBArticleInfo(JSON.parse(result_dict))
      );
    }
    getNativeLanguage().then((result) => setNativeLang(result));
  }, []);

  useEffect(() => {
    if (DBArticleInfo !== undefined) {
      setArticleId(DBArticleInfo.id);
      setArticleLanguage(DBArticleInfo.language);
      console.log(DBArticleInfo.language);
    }
  }, [DBArticleInfo]);

  useEffect(() => {
    if (articleId !== undefined) {
      let articleInfo = {
        url: url,
        content: content,
        id: articleId,
        title: title,
        language: articleLanguage,
        starred: false,
      };
      let image = getImage(content);
      setArticleImage(image);
      let arrInteractive = interactiveTextsWithTags(content, articleInfo, api);
      setInteractiveTextArray(arrInteractive);
  
      let itTitle = new InteractiveText(title, articleInfo, api);
      setInteractiveTitle(itTitle);
      api.logReaderActivity(EXTENSION_SOURCE, api.OPEN_ARTICLE,  articleId.article_id);

      window.addEventListener("focus", function(){onFocus(EXTENSION_SOURCE, api, articleId.article_id)});
      window.addEventListener("blur", function(){onBlur(EXTENSION_SOURCE, api, articleId.article_id)});

      let getModalClass = document.getElementsByClassName("Modal")
      if ((getModalClass !== undefined) && (getModalClass !== null)){
        setTimeout(() => {
          if(getModalClass.item(0) != undefined){
            getModalClass.item(0).addEventListener("scroll", function(){onScroll(EXTENSION_SOURCE, api, articleId.article_id)});
          }
        }, 0);
      }
    }
      
  }, [articleId]);

localStorage.setItem("native_language", nativeLang)


function handleClose() {
  location.reload();
  setModalIsOpen(false);
  api.logReaderActivity(EXTENSION_SOURCE, "ARTICLE CLOSED", articleId.article_id);
  window.removeEventListener("focus", function(){onFocus(EXTENSION_SOURCE, api, articleId.article_id)});
  window.removeEventListener("blur", function(){onBlur(EXTENSION_SOURCE, api, articleId.article_id)});
  document.getElementById("scrollHolder") !== null &&
  document
    .getElementById("scrollHolder")
    .removeEventListener("scroll", function(){onScroll(EXTENSION_SOURCE, api, articleId.article_id)});
};

if (!modalIsOpen) {
  location.reload();
}

function handlePostCopy() {
  api.makePersonalCopy(articleId, (message) => alert(message));
  api.logReaderActivity(EXTENSION_SOURCE, api.PERSONAL_COPY,  articleId.article_id);
};

function reportProblem(e) {
  let answer = prompt("What is wrong with the article?");
  if (answer) {
    let feedback = "problem_" + answer.replace(/ /g, "_");
    api.logReaderActivity(EXTENSION_SOURCE, api.EXTENSION_FEEDBACK, articleId, feedback);
  }
}
  
if (interactiveTextArray === undefined) {
  return <ZeeguuLoader/>
}

  return (
    <div>
      <GlobalStyle/>
      <StyledModal
        isOpen={modalIsOpen}
        className="Modal"
        id="scrollHolder"
      >
         <StyledHeading >
          <StyledCloseButton role="button" onClick={handleClose} id="qtClose">
            X
            </StyledCloseButton>
          <ToolbarButtons
           translating={translating}
           pronouncing={pronouncing}
           setTranslating={setTranslating}
           setPronouncing={setPronouncing}
          />
        </StyledHeading>
        <StyledButton onClick={reportProblem} >Report problems</StyledButton>
        <StyledButton onClick={handlePostCopy}>
          Make Personal Copy
          </StyledButton>
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        <p>{author}</p>
        <hr />
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
        <s.FeedbackBox>
        <h2>{strings.reviewVocabulary}</h2>
        <small>{strings.reviewVocabExplanation}</small>
        <br />
        <br />
        <s.CenteredContent>
          <a href="http://zeeguu.org" target="_blank" rel="noopener noreferrer">{strings.reviewVocabulary} » (Broken link)</a>
          </s.CenteredContent>
        </s.FeedbackBox>
      </StyledModal>
    </div>
  );
}
