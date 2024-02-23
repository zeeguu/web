/*global chrome*/
import { Modal } from "./Modal/Modal";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import {
  deleteCurrentDOM,
  getSourceAsDOM,
  getCurrentURL,
  getSessionId,
} from "../popup/functions";
import { Article } from "./Modal/Article";
import { generalClean } from "./Cleaning/generelClean";
import { cleanAfterArray, individualClean } from "./Cleaning/pageSpecificClean";
import Zeeguu_API from "../zeeguu-react/src/api/Zeeguu_API";
import DOMPurify from "dompurify";
import ZeeguuLoader from "./ZeeguuLoader";
import { addElements, drRegex, saveElements } from "./Cleaning/Pages/dr";
import { API_URL } from "../config";
import ZeeguuError from "./ZeeguuError";
import { isProbablyReaderable } from "@mozilla/readability";
import { checkReadability } from "../popup/checkReadability";
import { checkLanguageSupportFromUrl } from "../popup/functions";

export function Main(documentFromTab) {
  let api = new Zeeguu_API(API_URL);

  const [article, setArticle] = useState();
  const [url, setUrl] = useState();
  const [sessionId, setSessionId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isReadable, setIsReadable] = useState(false);
  const [languageSupported, setLanguageSupported] = useState(false);
  const [foundError, setFoundError] = useState();
  const minLength = 120;
  const minScore = 20;

  useEffect(() => {
    getSessionId().then((sessionId) => {
      setSessionId(sessionId);
      getCurrentURL().then((url) => {
        setUrl(url);
        Article(url).then((article) => {
          setArticle(article);
          const isProbablyReadable = isProbablyReaderable(
            documentFromTab,
            minLength,
            minScore
          );
          const ownIsProbablyReadable = checkReadability(url);
          if (!isProbablyReadable || !ownIsProbablyReadable) {
            setIsReadable(false);
            setLanguageSupported(false);
          } else {
            setIsReadable(true);
            if (api.session !== undefined) {
              checkLanguageSupportFromUrl(api, url, setLanguageSupported);
            }
          }
        });
      });
    });
  }, [url]);

  useEffect(() => {
    setFoundError(
      sessionId === undefined ||
        !languageSupported ||
        !isReadable ||
        article === null
    );
  }, [languageSupported, isReadable, article, sessionId]);

  console.log(foundError);
  api.session = sessionId;

  if (article === undefined || foundError === undefined) {
    return <ZeeguuLoader />;
  }

  if (foundError || article === null) {
    return (
      <ZeeguuError
        isNotReadable={!isReadable}
        isNotLanguageSupported={!languageSupported}
        isMissingSession={sessionId === undefined}
      />
    );
  }

  let cleanedContent = individualClean(article.content, url, cleanAfterArray);
  cleanedContent = generalClean(cleanedContent);
  cleanedContent = DOMPurify.sanitize(cleanedContent);
  return (
    <Modal
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      title={article.title}
      author={article.byline}
      content={cleanedContent}
      api={api}
      url={url}
    />
  );
}

const div = document.createElement("div");
const url = window.location.href;
const documentFromTab = getSourceAsDOM(url);

if (window.location.href.match(drRegex)) {
  const elements = saveElements();
  deleteCurrentDOM();
  addElements(elements);
} else {
  deleteCurrentDOM();
}

document.body.appendChild(div);
ReactDOM.render(<Main documentFromTab={documentFromTab} />, div);
