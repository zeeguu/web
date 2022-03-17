/*global chrome*/
import { useEffect, useState } from "react";
import {StyledModal, StyledCloseButton, StyledHeading, StyledButton, GlobalStyle} from "./Modal.styles";
import InteractiveText from "../../zeeguu-react/src/reader/InteractiveText";
import { TranslatableText } from "../../zeeguu-react/src/reader/TranslatableText";
import { getImage } from "../Cleaning/generelClean";
import { interactiveTextsWithTags } from "./interactivityFunctions";
import { getNativeLanguage } from "../../popup/functions";
import ZeeguuLoader from "../ZeeguuLoader";
import { EXTENSION_SOURCE, LIST_CONTENT, PARAGRAPH_CONTENT, HEADER_CONTENT } from "../constants";
import ToolbarButtons from "./ToolbarButtons";
import {onScroll, onBlur, onFocus} from "../../zeeguu-react/src/reader/ArticleReader";
import ReviewVocabulary from "./ReviewVocabulary";

export function Modal({title, content, modalIsOpen, setModalIsOpen, api, url, author}) {
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
      let itTitle = new InteractiveText(title, articleInfo, api, EXTENSION_SOURCE);
      setInteractiveTitle(itTitle);
      api.logReaderActivity(api.OPEN_ARTICLE, articleId, "",EXTENSION_SOURCE);

      window.addEventListener("focus", function () {onFocus(api, articleId, EXTENSION_SOURCE);});
      window.addEventListener("blur", function () {onBlur(api, articleId, EXTENSION_SOURCE);});

      let getModalClass = document.getElementsByClassName("Modal");
      if (getModalClass !== undefined && getModalClass !== null) {
        setTimeout(() => {
          if (getModalClass.item(0) != undefined) {
            getModalClass.item(0).addEventListener("scroll", function () {
              onScroll(api, articleId, EXTENSION_SOURCE);
            });
          }
        }, 0);
      }
    }
  }, [articleId]);

  localStorage.setItem("native_language", nativeLang);

  //Could be moved into another file
  function handleClose() {
    location.reload();
    setModalIsOpen(false);
    api.logReaderActivity("ARTICLE CLOSED", articleId, "", EXTENSION_SOURCE);
    window.removeEventListener("focus", function () {onFocus(api, articleId, EXTENSION_SOURCE);});
    window.removeEventListener("blur", function () {onBlur(api, articleId, EXTENSION_SOURCE);});
    document.getElementById("scrollHolder") !== null &&
      document
        .getElementById("scrollHolder")
        .removeEventListener("scroll", function () {
          onScroll(api, articleId, EXTENSION_SOURCE);
        });
  }

  if (!modalIsOpen) {
    location.reload();
  }

  //Could be moved into another file
  function handlePostCopy() {
    let article = {article_id: articleId}
    api.makePersonalCopy(article, (message) => alert(message));
    api.logReaderActivity(api.PERSONAL_COPY, articleId, "", EXTENSION_SOURCE);
  }

  //Could be moved into another file
  function reportProblem(e) {
    let answer = prompt("What is wrong with the article?");
    if (answer) {
      let feedback = "problem_" + answer.replace(/ /g, "_");
      api.logReaderActivity(api.EXTENSION_FEEDBACK, articleId, feedback, EXTENSION_SOURCE);
    }
  }

  if (interactiveTextArray === undefined) {
    return <ZeeguuLoader />;
  }

  return (
    <div>
      <GlobalStyle />
      <StyledModal isOpen={modalIsOpen} className="Modal" id="scrollHolder">
        <StyledHeading>
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
        <div className="article-container">
        <StyledButton onClick={reportProblem}>Report problems</StyledButton>
        <StyledButton onClick={handlePostCopy}>Make Personal Copy</StyledButton>
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        <p className="author">{author}</p>
        <hr />
        {articleImage === undefined ? null : (
          <img id="zeeguuImage" alt={articleImage.alt} src={articleImage.src}></img>
        )}
        {interactiveTextArray.map((paragraph) => {
          const CustomTag = `${paragraph.tag}`;
          if (HEADER_CONTENT.includes(paragraph.tag) || PARAGRAPH_CONTENT.includes(paragraph.tag)) {
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={paragraph.text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
              </CustomTag>
            );
          }
          if (LIST_CONTENT.includes(paragraph.tag)) {
            let list = Array.from(paragraph.list);
            return (
              <CustomTag>
                {list.map((paragraph, i) => {
                  return (
                    <li key={i}>
                      <TranslatableText
                        interactiveText={paragraph.text}
                        translating={translating}
                        pronouncing={pronouncing}
                      />
                    </li>
                  );
                })}
              </CustomTag>
            );
          }
        })}
        <ReviewVocabulary articleId={articleId}  api={api}/>
        </div>
      </StyledModal>
    </div>
  );
}
