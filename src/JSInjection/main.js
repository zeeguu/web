/*global chrome*/
import { Modal } from "./Modal/Modal";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { getCurrentURL } from "../popup/functions";
import { Article } from "./Modal/Article";
import { generalClean } from "./Cleaning/generelClean";
import { pageSpecificClean } from "./Cleaning/pageSpecificClean";
import Zeeguu_API from "../zeeguu-react/src/api/Zeeguu_API";


let api = new Zeeguu_API("https://api.zeeguu.org");

export function Main() {
  const [article, setArticle] = useState();
  const [url, setUrl] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(true);

  useEffect(() => {
    getCurrentURL().then((url) => {
      setUrl(url);
      Article(url).then((article) => {
        setArticle(article);
      });
    });
    
  }, [url]);

  if (article === undefined) {
    return <div>Loading</div>;
  }
  let cleanedContent = pageSpecificClean(article.content, url);
  cleanedContent = generalClean(cleanedContent);
  console.log(article.lang)

  return (
    <Modal
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      title={article.title}
      content={cleanedContent}
      api={api}
      url={url}
    />
  );
}
document.open();
document.write();
document.close();

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(<Main />, div);
