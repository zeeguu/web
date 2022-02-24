/*global chrome*/
import { Modal } from "./Modal/Modal";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { getCurrentURL, getAPI } from "../popup/functions";
import { Article } from "./Modal/Article";
import { generalClean } from "./Cleaning/generelClean";
import { pageSpecificClean } from "./Cleaning/pageSpecificClean";

export function Main() {
  const [article, setArticle] = useState();
  const [url, setUrl] = useState();
  const [api, setApi] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(true);

  useEffect(() => {
    getAPI().then((api) =>{
      setApi(api)
    getCurrentURL().then((url) => {
      setUrl(url);
      Article(url).then((article) => {
        setArticle(article);
      });
    });
     })
  }, [url]);

  if (article === undefined) {
    return <div>Loading</div>;
  }
  let cleanedContent = pageSpecificClean(article.content, url);
  cleanedContent = generalClean(cleanedContent);


  return (
    <Modal
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      title={article.title}
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
