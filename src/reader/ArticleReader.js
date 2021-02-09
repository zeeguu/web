import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import './article.css'
import * as s from "./ArticleReader.sc";

import { TranslatableText } from "./TranslatableText";

import InteractiveText from "./InteractiveText";

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ArticleReader({ api }) {
  let query = useQuery();

  const articleID = query.get("id");

  const [articleInfo, setArticleInfo] = useState();
  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();

  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);

  const [undoCount, setUndoCount] = useState(0);

  useEffect(() => {
    api.getArticleInfo(articleID, (data) => {
      console.log(data);
      setInteractiveText(new InteractiveText(data.content, data, api));
      setInteractiveTitle(new InteractiveText(data.title, data, api));
      setArticleInfo(data);
    });
  }, []);

  function toggle(state, togglerFunction) {
    togglerFunction(!state);
  }

  if (!articleInfo) {
    return <div>'...'</div>;
  }
  return (
    <s.ArticleReader>
      <header className="articleHeader">
        <div id="toolbarContainer" className="toolbar">
          <div className="main-tools">
            <div>
              <button
                className={"tool " + (translating ? "selected" : "")}
                id="toggle_translate"
                onClick={(e) => toggle(translating, setTranslating)}
              >
                <img
                  className="click_translate"
                  src="/static/images/translate.svg"
                  alt="translate on click"
                />
                <span className="tooltiptext">translate on click</span>
              </button>
              <button
                className={"tool " + (pronouncing ? "selected" : "")}
                id="toggle_listen"
                onClick={(e) => toggle(pronouncing, setPronouncing)}
              >
                <img
                  className="click_listen"
                  src="/static/images/sound.svg"
                  alt="listen on click"
                />
                <span className="tooltiptext">listen on click</span>
              </button>
              <button
                className="tool"
                id="toggle_undo"
                onClick={(e) => {
                  console.log("about to undo...");
                  interactiveText.undo();
                  setUndoCount(undoCount + 1);
                }}
              >
                <img src="/static/images/undo.svg" alt="undo a translation" />
                <span className="tooltiptext">undo translation</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="layout__content">
        <div id="main_article_content" className="page-content-container">
          <div className="content-container">
            <div className="page-content">
              <div className="title translatable noselect">
                <span id="articleTitle">
                  <TranslatableText
                    interactiveText={interactiveTitle}
                    translating={translating}
                    pronouncing={pronouncing}
                  />
                </span>
              </div>
              <hr className="seperator"></hr>

              <div className="articleDetails">
                <button id="bookmark_button" className="bookmark_button">
                  <img
                    className="bookmark_icon_done"
                    src="/static/images/bookmark-done.svg"
                    alt="bookmark this article"
                  />
                  <img
                    className="bookmark_icon_undone"
                    src="/static/images/bookmark-undone.svg"
                    alt="bookmark this article"
                    style={{ display: "none" }}
                  />
                  <span className="bookmarkText">Save to Bookmarks</span>
                </button>

                <div id="articleInfo" className="noselect">
                  <div id="articleURL">
                    <a
                      href={articleInfo.url}
                      target="_blank"
                      rel="noreferrer"
                      id="source"
                    >
                      source
                    </a>
                  </div>
                  <div id="authors">{articleInfo.authors}</div>
                </div>
              </div>

              <div id="articleContent">
                <div className="p-article-reader">
                  <TranslatableText
                    interactiveText={interactiveText}
                    translating={translating}
                    pronouncing={pronouncing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </s.ArticleReader>
  );
}
