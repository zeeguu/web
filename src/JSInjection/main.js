/*global chrome*/
import { Modal } from "./Modal/Modal";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { getCurrentURL, getSessionId } from "../popup/functions";
import { Article } from "./Modal/Article";
import { generalClean } from "./Cleaning/generelClean";
import { pageSpecificClean } from "./Cleaning/pageSpecificClean";
import Zeeguu_API from "../zeeguu-react/src/api/Zeeguu_API";
import DOMPurify from "dompurify";

export function Main() {
  let api = new Zeeguu_API("https://api.zeeguu.org");

  const [article, setArticle] = useState();
  const [url, setUrl] = useState();
  const [sessionId, setSessionId] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(true);

  useEffect(() => {
    getSessionId().then((sessionId) => {
      setSessionId(sessionId);
      getCurrentURL().then((url) => {
        setUrl(url);
        Article(url).then((article) => {
          setArticle(article);
        });
      });
    });
  }, [url]);

  api.session = sessionId;

  if (article === undefined) {
    return <div>Loading</div>;
  }

  let cleanedContent = pageSpecificClean(article.content, url);
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
      language={article.lang}
    />
  );
}
document.open();
document.write();
document.close();

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<Main />, div);
